import torch
import torch.nn as nn
import timm
from torchvision import transforms
from PIL import Image
import os

class ViTDetector:
    def __init__(self, model_path=None, device=None):
        self.device = device if device else ('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = self._build_model()

        if model_path and os.path.exists(model_path):
            self.load_model(model_path)

        self.model.to(self.device)
        self.model.eval()

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def _build_model(self):
        model = timm.create_model('vit_base_patch16_224', pretrained=True, num_classes=2)
        return model

    def load_model(self, model_path):
        try:
            checkpoint = torch.load(model_path, map_location=self.device)
            self.model.load_state_dict(checkpoint)
            print(f"Model loaded successfully from {model_path}")
        except Exception as e:
            print(f"Warning: Could not load model from {model_path}: {e}")
            print("Using pretrained weights instead")

    def save_model(self, model_path):
        torch.save(self.model.state_dict(), model_path)
        print(f"Model saved successfully to {model_path}")

    def preprocess_image(self, image_path):
        if isinstance(image_path, str):
            image = Image.open(image_path).convert('RGB')
        else:
            image = Image.open(image_path).convert('RGB')

        image_tensor = self.transform(image).unsqueeze(0)
        return image_tensor.to(self.device)

    def predict(self, image_path):
        image_tensor = self.preprocess_image(image_path)

        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            predicted_class = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][predicted_class].item()

        label = "REAL" if predicted_class == 0 else "FAKE"

        return {
            'prediction': label,
            'confidence': confidence,
            'probabilities': {
                'real': probabilities[0][0].item(),
                'fake': probabilities[0][1].item()
            }
        }

detector_instance = None

def get_detector(model_path=None):
    global detector_instance
    if detector_instance is None:
        detector_instance = ViTDetector(model_path=model_path)
    return detector_instance
