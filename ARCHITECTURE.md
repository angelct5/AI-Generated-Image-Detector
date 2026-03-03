# System Architecture

## Overview

The AI Image Detector is a full-stack application that uses deep learning to classify images as real or AI-generated. The system follows a three-tier architecture:

1. **Frontend (Presentation Layer)** - React/TypeScript SPA
2. **Backend (Application Layer)** - Django REST API
3. **ML Layer (Intelligence Layer)** - PyTorch Vision Transformer

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Landing Page │  │ImageDetector │  │  API Service │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (Django)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ REST API     │  │   Models     │  │    Views     │       │
│  │ (DRF)        │  │ (SQLite)     │  │ (Business    │       │
│  │              │  │              │  │  Logic)      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Inference
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    ML Layer (PyTorch)                         │
│  ┌──────────────────────────────────────────────────┐       │
│  │          Vision Transformer (ViT) Model           │       │
│  │                                                    │       │
│  │  • Image Preprocessing                            │       │
│  │  • Patch Embedding (16x16)                        │       │
│  │  • Transformer Encoder (12 layers)                │       │
│  │  • Classification Head (2 classes)                │       │
│  │  • Softmax Output                                 │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Components

#### 1. LandingPage Component
- **Purpose**: Landing page with hero section and feature highlights
- **Props**: `onGetStarted` callback
- **Features**:
  - Hero section with call-to-action
  - Feature cards explaining ViT, speed, and privacy
  - Responsive design
  - Gradient backgrounds and animations

#### 2. ImageDetector Component
- **Purpose**: Image upload, analysis, and results display
- **Props**: `onBack` callback
- **Features**:
  - Drag-and-drop image upload
  - Real-time prediction results
  - Confidence scores with visual progress bars
  - Probability distribution (Real vs Fake)
  - Loading states and error handling

#### 3. API Service
- **Purpose**: HTTP client for backend communication
- **Functions**:
  - `predictImage(file)` - Upload image for classification
  - `getPredictionHistory()` - Fetch recent predictions
  - `checkHealth()` - API health check

### Backend Components

#### 1. Django REST API
- **Framework**: Django 4.2 + Django REST Framework
- **Endpoints**:
  - `POST /api/predict/` - Image classification endpoint
  - `GET /api/history/` - Prediction history
  - `GET /api/health/` - Health check

#### 2. Models
- **PredictionHistory**: Stores prediction records
  - `image` - ImageField
  - `prediction` - CharField (REAL/FAKE)
  - `confidence` - FloatField
  - `created_at` - DateTimeField

#### 3. Views
- **PredictImageView**: Handles image upload and prediction
- **PredictionHistoryView**: Returns prediction history
- **HealthCheckView**: API status check

### ML Layer

#### Vision Transformer Architecture

**Model**: `vit_base_patch16_224` from timm library

**Specifications**:
- Input resolution: 224×224 pixels
- Patch size: 16×16 pixels
- Number of patches: 14×14 = 196
- Embedding dimension: 768
- Number of layers: 12
- Number of attention heads: 12
- MLP dimension: 3072
- Number of classes: 2 (Real, Fake)

**Processing Pipeline**:

1. **Image Preprocessing**:
   ```
   Input Image → Resize(224×224) → ToTensor() → Normalize()
   ```

2. **Patch Embedding**:
   ```
   Image → Patches(16×16) → Linear Projection → + Position Embedding
   ```

3. **Transformer Encoder**:
   ```
   Embedded Patches → 12× [
     Multi-Head Self-Attention →
     Layer Norm →
     MLP →
     Layer Norm
   ]
   ```

4. **Classification**:
   ```
   [CLS] Token → MLP Head → Softmax → [P(Real), P(Fake)]
   ```

**Training Process**:
- Optimizer: Adam (lr=1e-4)
- Loss: Binary Cross-Entropy
- Augmentation: Horizontal flip, rotation, color jitter
- Epochs: 50 (with early stopping)
- Batch size: 32
- Validation split: 20%

## Data Flow

### Prediction Flow

```
1. User uploads image
   ↓
2. Frontend sends POST request to /api/predict/
   ↓
3. Django receives multipart/form-data
   ↓
4. Image saved temporarily
   ↓
5. ViTDetector.predict() called
   ↓
6. Image preprocessing
   ↓
7. Forward pass through ViT model
   ↓
8. Softmax probabilities computed
   ↓
9. Prediction saved to database
   ↓
10. Response sent to frontend
   ↓
11. Results displayed to user
```

### Training Flow

```
1. Dataset organized (REAL/ and FAKE/ folders)
   ↓
2. AIImageDataset loads images
   ↓
3. Data augmentation applied
   ↓
4. Batch creation (32 images)
   ↓
5. Forward pass through model
   ↓
6. Loss computation
   ↓
7. Backward pass (gradients)
   ↓
8. Weight update (Adam optimizer)
   ↓
9. Validation after each epoch
   ↓
10. Best model saved (highest validation accuracy)
```

## Technology Stack Details

### Frontend
- **React 18**: UI framework with hooks
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### Backend
- **Django 4.2**: Web framework
- **Django REST Framework**: API toolkit
- **Django CORS Headers**: CORS middleware
- **python-dotenv**: Environment variables
- **Pillow**: Image processing

### ML
- **PyTorch 2.1**: Deep learning framework
- **torchvision**: Vision utilities
- **timm**: Model architectures
- **numpy**: Numerical computations

### Development
- **SQLite**: Development database
- **ESLint**: Code linting
- **TypeScript**: Static typing

## Security Considerations

1. **Input Validation**:
   - File type checking (only images)
   - File size limits
   - Image format validation

2. **CORS Configuration**:
   - Allowed origins configured
   - Credentials support
   - Method restrictions

3. **Data Privacy**:
   - Images stored temporarily
   - Optional prediction history
   - No user tracking

4. **Model Security**:
   - Model weights stored securely
   - No model architecture exposure
   - Rate limiting (recommended for production)

## Performance Characteristics

### Latency
- Image upload: ~100-500ms (network dependent)
- Model inference:
  - GPU: ~50-200ms
  - CPU: ~1-3 seconds
- Total response time: ~1-4 seconds

### Throughput
- Sequential: 1-20 predictions/second (hardware dependent)
- With batch processing: 50-100 predictions/second (GPU)

### Resource Usage
- Model size: ~85MB (ViT base)
- RAM usage: ~2-4GB (with model loaded)
- GPU VRAM: ~2-4GB (during inference)

## Scalability

### Horizontal Scaling
- Frontend: Static files, easily scalable with CDN
- Backend: Stateless API, can run multiple instances
- ML: Can use separate inference server

### Vertical Scaling
- Batch processing for multiple images
- GPU acceleration for faster inference
- Model quantization for reduced memory

### Production Optimizations
1. Use Redis for caching
2. Implement request queuing
3. Deploy ML model as separate service
4. Use load balancer for multiple instances
5. Enable GPU acceleration
6. Implement model versioning
7. Add monitoring and logging

## Future Enhancements

1. **Model Improvements**:
   - Ensemble models
   - Attention visualization
   - Explainability features (Grad-CAM)

2. **Features**:
   - Batch image upload
   - Real-time video analysis
   - API key authentication
   - User accounts

3. **Performance**:
   - Model quantization
   - TensorRT optimization
   - WebAssembly for client-side inference

4. **UI/UX**:
   - Dark mode
   - Mobile app
   - Progressive Web App

## Monitoring and Logging

### Recommended Metrics
- Request count and latency
- Model inference time
- Error rates
- Prediction distribution
- Resource utilization

### Logging Strategy
- Request/response logging
- Error tracking
- Performance metrics
- Model prediction logs
- User analytics (with consent)
