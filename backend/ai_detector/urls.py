from django.urls import path
from .views import PredictImageView, PredictionHistoryView, HealthCheckView

urlpatterns = [
    path('predict/', PredictImageView.as_view(), name='predict-image'),
    path('history/', PredictionHistoryView.as_view(), name='prediction-history'),
    path('health/', HealthCheckView.as_view(), name='health-check'),
]
