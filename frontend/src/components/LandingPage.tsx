import { Brain, Shield, Zap, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">AI Detector</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-full text-sm font-semibold mb-6 border border-cyan-500/20">
              Powered by Vision Transformer
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Detect AI-Generated
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Images with Precision
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Advanced deep learning technology using Vision Transformers to distinguish between real photographs and AI-generated synthetic images with high accuracy.
          </p>

          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
          >
            Start Detection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Vision Transformer</h3>
              <p className="text-slate-400">
                State-of-the-art transformer architecture specifically trained to detect AI-generated images with 98%+ accuracy.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Results</h3>
              <p className="text-slate-400">
                Get real-time predictions with detailed confidence scores and probability distributions in seconds.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Privacy Focused</h3>
              <p className="text-slate-400">
                Your images are processed securely and can be optionally saved for improving model accuracy.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 mt-20 border-t border-slate-800">
        <p className="text-center text-slate-400">
          Powered by PyTorch, Django, and React | Using Vision Transformer (ViT) Architecture
        </p>
      </footer>
    </div>
  );
}
