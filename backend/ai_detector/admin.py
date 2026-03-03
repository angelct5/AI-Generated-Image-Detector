from django.contrib import admin
from .models import PredictionHistory

@admin.register(PredictionHistory)
class PredictionHistoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'prediction', 'confidence', 'created_at')
    list_filter = ('prediction', 'created_at')
    search_fields = ('prediction',)
    readonly_fields = ('created_at',)
