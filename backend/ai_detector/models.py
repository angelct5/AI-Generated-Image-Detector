from django.db import models

class PredictionHistory(models.Model):
    image = models.ImageField(upload_to='predictions/')
    prediction = models.CharField(max_length=10)
    confidence = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.prediction} - {self.confidence:.2%} - {self.created_at}"
