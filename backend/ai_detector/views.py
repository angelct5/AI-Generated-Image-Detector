from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from .models import PredictionHistory
from .serializers import PredictionSerializer, ImageUploadSerializer
from .ml_model.vit_model import get_detector
import os

class PredictImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = ImageUploadSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid image file'},
                status=status.HTTP_400_BAD_REQUEST
            )

        image_file = serializer.validated_data['image']

        try:
            detector = get_detector(model_path=settings.MODEL_PATH if os.path.exists(settings.MODEL_PATH) else None)

            result = detector.predict(image_file)

            prediction_history = PredictionHistory.objects.create(
                image=image_file,
                prediction=result['prediction'],
                confidence=result['confidence']
            )

            response_data = {
                'id': prediction_history.id,
                'prediction': result['prediction'],
                'confidence': result['confidence'],
                'probabilities': result['probabilities'],
                'message': f'Image classified as {result["prediction"]} with {result["confidence"]*100:.2f}% confidence'
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Prediction failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PredictionHistoryView(APIView):
    def get(self, request, *args, **kwargs):
        predictions = PredictionHistory.objects.all()[:20]
        serializer = PredictionSerializer(predictions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class HealthCheckView(APIView):
    def get(self, request, *args, **kwargs):
        return Response(
            {'status': 'healthy', 'message': 'AI Image Detector API is running'},
            status=status.HTTP_200_OK
        )
