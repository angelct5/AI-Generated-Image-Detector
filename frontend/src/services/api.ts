const API_BASE_URL = 'http://localhost:8000/api';

export interface PredictionResult {
  id: number;
  prediction: string;
  confidence: number;
  probabilities: {
    real: number;
    fake: number;
  };
  message: string;
}

export interface PredictionHistory {
  id: number;
  image: string;
  prediction: string;
  confidence: number;
  created_at: string;
}

export const predictImage = async (imageFile: File): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_BASE_URL}/predict/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Prediction failed');
  }

  return response.json();
};

export const getPredictionHistory = async (): Promise<PredictionHistory[]> => {
  const response = await fetch(`${API_BASE_URL}/history/`);

  if (!response.ok) {
    throw new Error('Failed to fetch prediction history');
  }

  return response.json();
};

export const checkHealth = async (): Promise<{ status: string; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/health/`);

  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
};
