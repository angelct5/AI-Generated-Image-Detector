import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
import os
from pathlib import Path
import timm
from tqdm import tqdm

class AIImageDataset(Dataset):
    def __init__(self, data_dir, transform=None):
        self.data_dir = Path(data_dir)
        self.transform = transform

        self.real_dir = self.data_dir / 'REAL'
        self.fake_dir = self.data_dir / 'FAKE'

        self.images = []
        self.labels = []

        if self.real_dir.exists():
            for img_path in self.real_dir.glob('*.jpg'):
                self.images.append(img_path)
                self.labels.append(0)
            for img_path in self.real_dir.glob('*.png'):
                self.images.append(img_path)
                self.labels.append(0)

        if self.fake_dir.exists():
            for img_path in self.fake_dir.glob('*.jpg'):
                self.images.append(img_path)
                self.labels.append(1)
            for img_path in self.fake_dir.glob('*.png'):
                self.images.append(img_path)
                self.labels.append(1)

        print(f"Loaded {len(self.images)} images ({sum(1 for l in self.labels if l == 0)} real, {sum(1 for l in self.labels if l == 1)} fake)")

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        img_path = self.images[idx]
        label = self.labels[idx]

        image = Image.open(img_path).convert('RGB')

        if self.transform:
            image = self.transform(image)

        return image, label

def train_vit_model(data_dir, output_path='vit_model.pth', epochs=50, batch_size=32, learning_rate=1e-4):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")

    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    full_dataset = AIImageDataset(data_dir, transform=train_transform)

    train_size = int(0.8 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = torch.utils.data.random_split(full_dataset, [train_size, val_size])

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=4)

    model = timm.create_model('vit_base_patch16_224', pretrained=True, num_classes=2)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=3, factor=0.5)

    best_val_acc = 0.0

    for epoch in range(epochs):
        model.train()
        train_loss = 0.0
        train_correct = 0
        train_total = 0

        pbar = tqdm(train_loader, desc=f'Epoch {epoch+1}/{epochs}')
        for images, labels in pbar:
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            train_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            train_total += labels.size(0)
            train_correct += (predicted == labels).sum().item()

            pbar.set_postfix({'loss': train_loss/len(train_loader), 'acc': 100.*train_correct/train_total})

        train_acc = 100. * train_correct / train_total

        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)

                val_loss += loss.item()
                _, predicted = torch.max(outputs.data, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).sum().item()

        val_acc = 100. * val_correct / val_total

        print(f'Epoch {epoch+1}: Train Loss: {train_loss/len(train_loader):.4f}, Train Acc: {train_acc:.2f}%, Val Loss: {val_loss/len(val_loader):.4f}, Val Acc: {val_acc:.2f}%')

        scheduler.step(val_loss)

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), output_path)
            print(f'Model saved with validation accuracy: {val_acc:.2f}%')

    print(f'Training complete. Best validation accuracy: {best_val_acc:.2f}%')
    return model

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Train Vision Transformer for AI Image Detection')
    parser.add_argument('--data_dir', type=str, required=True, help='Path to dataset directory')
    parser.add_argument('--output', type=str, default='vit_model.pth', help='Output model path')
    parser.add_argument('--epochs', type=int, default=50, help='Number of epochs')
    parser.add_argument('--batch_size', type=int, default=32, help='Batch size')
    parser.add_argument('--lr', type=float, default=1e-4, help='Learning rate')

    args = parser.parse_args()

    train_vit_model(
        data_dir=args.data_dir,
        output_path=args.output,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.lr
    )
