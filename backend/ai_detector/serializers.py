from rest_framework import serializers
from .models import PredictionHistory

class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionHistory
        fields = ['id', 'image', 'prediction', 'confidence', 'created_at']
        read_only_fields = ['id', 'created_at']

class ImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()
