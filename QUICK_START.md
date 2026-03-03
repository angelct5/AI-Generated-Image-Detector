# Quick Start Guide

Get the AI Image Detector running in 5 minutes!

## Prerequisites

- Python 3.8+
- Node.js 16+

## Quick Setup

### 1. Backend (Terminal 1)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### 2. Frontend (Terminal 2)

```bash
npm install
npm run dev
```

### 3. Open Application

Visit: http://localhost:5173

## First Use

The application will use pretrained Vision Transformer weights. For better accuracy on fake image detection:

1. Download the CIFAKE dataset from Kaggle
2. Train the model using the instructions in SETUP.md
3. Place the trained model at: `backend/ai_detector/ml_model/vit_model.pth`

## Test It

1. Click "Start Detection"
2. Upload any image
3. Click "Analyze Image"
4. View results!

## Note on Model

Without training on fake images, the model will use general ImageNet pretrained weights. For production use, training on the CIFAKE dataset is highly recommended for accurate fake detection.

See SETUP.md for detailed training instructions.
