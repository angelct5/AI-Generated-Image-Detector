# Complete Setup Guide

This guide will walk you through setting up the AI Image Detector application from scratch.

## Prerequisites

Make sure you have the following installed:
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- Git

## Step-by-Step Setup

### 1. Backend Setup (Django + PyTorch)

#### Install Python Dependencies

```bash
cd backend
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

pip install -r requirements.txt
```

#### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your configuration (optional for basic usage):
```
DJANGO_SECRET_KEY=your-random-secret-key
DEBUG=True
VITE_SUPABASE_URL=your-supabase-url (optional)
VITE_SUPABASE_ANON_KEY=your-supabase-key (optional)
```

#### Initialize Database

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Optional, for admin access
```

#### Start Backend Server

```bash
python manage.py runserver 8000
```

The API will be available at: http://localhost:8000/api/

### 2. Frontend Setup (React + Vite)

#### Install Node Dependencies

Open a new terminal window and run:

```bash
npm install
```

#### Start Frontend Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:5173

### 3. Training the Model (Optional but Recommended)

To train your own model on the CIFAKE dataset:

#### Download Dataset

1. Go to: https://www.kaggle.com/datasets/birdy654/cifake-real-and-ai-generated-synthetic-images
2. Download and extract the dataset
3. Organize it as:

```
dataset/
├── REAL/
│   └── (real images)
└── FAKE/
    └── (AI-generated images)
```

#### Train the Model

```bash
cd backend
python ai_detector/ml_model/train_model.py \
  --data_dir /path/to/dataset \
  --output ai_detector/ml_model/vit_model.pth \
  --epochs 50 \
  --batch_size 32 \
  --lr 0.0001
```

Training parameters:
- `--data_dir`: Path to your organized dataset
- `--output`: Where to save the trained model
- `--epochs`: Number of training epochs (default: 50)
- `--batch_size`: Batch size for training (default: 32)
- `--lr`: Learning rate (default: 1e-4)

**Note**: Training requires a GPU for reasonable performance. On CPU, training will be very slow.

Expected training time:
- With GPU (NVIDIA RTX 3080): ~2-3 hours
- With CPU: ~20-30 hours

### 4. Using a Pre-trained Model

If you don't want to train from scratch, the application will use pretrained Vision Transformer weights from ImageNet. While not optimized for fake image detection, it can still provide reasonable results.

To use your own trained model:
1. Train the model as described above
2. Ensure the model file is at: `backend/ai_detector/ml_model/vit_model.pth`
3. Restart the Django server

### 5. Testing the Application

1. Open http://localhost:5173 in your browser
2. Click "Start Detection"
3. Upload a test image
4. Click "Analyze Image"
5. View the results

### 6. API Testing

You can test the API directly using curl:

```bash
curl -X POST -F "image=@/path/to/test_image.jpg" \
  http://localhost:8000/api/predict/
```

Or using the health check:

```bash
curl http://localhost:8000/api/health/
```

## Common Issues and Solutions

### Issue: Module not found error

**Solution**: Make sure you're in the correct directory and have activated the virtual environment:
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

### Issue: CORS errors in browser console

**Solution**: Ensure the Django server is running on port 8000 and the frontend on port 5173. Check `backend/config/settings.py` CORS configuration.

### Issue: Out of memory during training

**Solution**: Reduce batch size:
```bash
python ai_detector/ml_model/train_model.py --data_dir /path --batch_size 16
```

### Issue: Slow predictions

**Solution**:
- Ensure PyTorch is using GPU if available
- Check if CUDA is properly installed for GPU acceleration
- For CPU-only systems, predictions will be slower (2-5 seconds per image)

### Issue: Model not loading

**Solution**: The application will fall back to pretrained ImageNet weights if the custom model is not found. To use your trained model, ensure it's located at:
```
backend/ai_detector/ml_model/vit_model.pth
```

## Production Deployment

For production deployment:

1. Set `DEBUG=False` in Django settings
2. Use a production WSGI server (gunicorn, uWSGI)
3. Serve static files with nginx or similar
4. Use PostgreSQL instead of SQLite
5. Build the React frontend:
   ```bash
   npm run build
   ```
6. Serve the built files with a web server

## GPU Acceleration

For best performance, use CUDA-enabled GPU:

```bash
# Check if PyTorch can access GPU
python -c "import torch; print(torch.cuda.is_available())"
```

If False, you may need to install CUDA-enabled PyTorch:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

## System Requirements

### Minimum:
- CPU: 4 cores
- RAM: 8GB
- Storage: 10GB
- OS: Windows 10, macOS 10.15, or Linux

### Recommended:
- CPU: 8+ cores
- RAM: 16GB
- GPU: NVIDIA GPU with 6GB+ VRAM
- Storage: 20GB SSD
- OS: Ubuntu 20.04+ or Windows 11

## Support

For issues, refer to:
- Django documentation: https://docs.djangoproject.com/
- React documentation: https://react.dev/
- PyTorch documentation: https://pytorch.org/docs/
- Vision Transformers paper: https://arxiv.org/abs/2010.11929

## Next Steps

After setup:
1. Train the model on your dataset or use pretrained weights
2. Test with various images
3. Monitor prediction accuracy
4. Fine-tune model parameters if needed
5. Deploy to production when ready
