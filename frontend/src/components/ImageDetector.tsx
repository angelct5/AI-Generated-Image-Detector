import { useState, useRef } from 'react';
import { Upload, ArrowLeft, Image as ImageIcon, CheckCircle, XCircle, Loader } from 'lucide-react';
import { predictImage, PredictionResult } from '../services/api';

interface ImageDetectorProps {
  onBack: () => void;
}

export default function ImageDetector({ onBack }: ImageDetectorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setPrediction(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const result = await predictImage(selectedFile);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="container mx-auto px-6 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            AI Image Detection
          </h1>
          <p className="text-slate-400 text-center mb-12">
            Upload an image to check if it's real or AI-generated
          </p>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8">
            {!selectedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-600 rounded-lg p-16 text-center cursor-pointer hover:border-cyan-500 transition-colors"
              >
                <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 text-lg mb-2">Click to upload an image</p>
                <p className="text-slate-500 text-sm">Supports JPG, PNG formats</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                </div>

                {!prediction && !loading && (
                  <div className="flex gap-4">
                    <button
                      onClick={handleAnalyze}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                    >
                      Analyze Image
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors"
                    >
                      Choose Another
                    </button>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-8">
                    <Loader className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-300">Analyzing image...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                    {error}
                  </div>
                )}

                {prediction && (
                  <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                      {prediction.prediction === 'REAL' ? (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      ) : (
                        <XCircle className="w-8 h-8 text-red-400" />
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {prediction.prediction === 'REAL' ? 'Real Image' : 'AI-Generated Image'}
                        </h3>
                        <p className="text-slate-400">
                          Confidence: {(prediction.confidence * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Real</span>
                          <span className="text-white font-semibold">
                            {(prediction.probabilities.real * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${prediction.probabilities.real * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">AI-Generated</span>
                          <span className="text-white font-semibold">
                            {(prediction.probabilities.fake * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${prediction.probabilities.fake * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleReset}
                      className="w-full mt-6 px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors"
                    >
                      Analyze Another Image
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-12 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-start gap-4">
              <ImageIcon className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How it works</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  This AI detector uses a Vision Transformer (ViT) model trained on thousands of real and AI-generated images.
                  The model analyzes visual patterns, artifacts, and features that distinguish synthetic images from authentic photographs.
                  Results include a classification (Real or Fake) along with confidence scores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
