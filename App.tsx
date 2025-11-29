import React, { useState, useCallback } from 'react';
import { AnalysisResult, AnalysisStatus } from './types';
import { analyzeImageForensics } from './services/geminiService';
import { DragDrop } from './components/DragDrop';
import { ResultDashboard } from './components/ResultDashboard';
import { Scanner } from './components/Scanner';
import { Aperture, Github, Info } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setStatus(AnalysisStatus.UPLOADING);
    setErrorMsg(null);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const mimeType = file.type;

        setStatus(AnalysisStatus.ANALYZING);
        
        // Call Gemini Service
        const analysisData = await analyzeImageForensics(base64String, mimeType);
        
        setResult(analysisData);
        setStatus(AnalysisStatus.COMPLETE);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to analyze the image. Please try again or use a different file.");
        setStatus(AnalysisStatus.ERROR);
      }
    };
    
    reader.onerror = () => {
      setErrorMsg("Failed to read the file.");
      setStatus(AnalysisStatus.ERROR);
    };

    reader.readAsDataURL(file);
  }, []);

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setImageSrc(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 rounded-lg text-white">
              <Aperture size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Veritas Lens</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-slate-900 transition-colors hidden sm:block">Methodology</a>
            <a href="#" className="hover:text-slate-900 transition-colors hidden sm:block">API</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
          
          {/* Header Section (Only show when not viewing results) */}
          {status !== AnalysisStatus.COMPLETE && (
            <div className="text-center mb-12 animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                Verify Reality in the <span className="text-blue-600">Age of AI</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Advanced forensic analysis powered by Gemini 1.5 Pro. Detect diffusion artifacts, lighting inconsistencies, and deepfake indicators with 90%+ precision.
              </p>
            </div>
          )}

          {/* Dynamic Content Area */}
          <div className="flex-grow flex flex-col items-center justify-center w-full">
            
            {(status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR) && (
              <div className="w-full animate-fade-in">
                <DragDrop onFileSelect={processFile} disabled={false} />
                {status === AnalysisStatus.ERROR && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 max-w-2xl mx-auto text-center">
                    {errorMsg}
                    <button onClick={handleReset} className="ml-2 underline hover:text-red-900">Try Again</button>
                  </div>
                )}
              </div>
            )}

            {(status === AnalysisStatus.UPLOADING || status === AnalysisStatus.ANALYZING) && (
              <Scanner />
            )}

            {status === AnalysisStatus.COMPLETE && result && (
              <ResultDashboard 
                result={result} 
                imageSrc={imageSrc} 
                onReset={handleReset} 
              />
            )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500">
          <p>© 2024 Veritas Lens. All rights reserved.</p>
          <div className="flex items-center gap-1 mt-4 sm:mt-0">
            <Info size={14} />
            <span>Powered by Gemini 1.5 Pro Forensic Engine</span>
          </div>
        </div>
      </footer>

      {/* Tailwind Custom Animations definition using style tag for this limitation */}
      <style>{`
        @keyframes scan {
          0% { background-position: 0% 100%; }
          100% { background-position: 0% 0%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;