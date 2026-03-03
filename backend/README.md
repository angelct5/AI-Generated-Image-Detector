# AI Image Detector Backend

This is the Django backend for the AI Image Detector application using Vision Transformer (ViT) model.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and configure your environment variables

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver 8000
```

## Training the Model

To train the Vision Transformer model on your dataset:

```bash
python ai_detector/ml_model/train_model.py --data_dir /path/to/dataset --epochs 50 --batch_size 32
```

The dataset should be organized as:
```
dataset/
├── REAL/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
└── FAKE/
    ├── image1.jpg
    ├── image2.jpg
    └── ...
```

After training, the model will be saved as `vit_model.pth`.

## API Endpoints

- `POST /api/predict/` - Upload an image for prediction
- `GET /api/history/` - Get prediction history
- `GET /api/health/` - Health check endpoint

## Testing

Test the prediction endpoint:
```bash
curl -X POST -F "image=@test_image.jpg" http://localhost:8000/api/predict/
```
