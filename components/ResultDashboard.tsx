import React from 'react';
import { ResultDashboardProps } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, RotateCcw, Search, Eye, Fingerprint, Image as ImageIcon, Sun } from 'lucide-react';

export const ResultDashboard: React.FC<ResultDashboardProps> = ({ result, imageSrc, onReset }) => {
  
  // Data for the gauge chart
  const data = [
    { name: 'Confidence', value: result.confidenceScore },
    { name: 'Remaining', value: 100 - result.confidenceScore },
  ];

  // Determine color based on verdict
  let statusColor = '#64748b'; // slate-500 default
  let statusBg = 'bg-slate-100';
  let StatusIcon = AlertTriangle;

  if (result.verdict === 'LIKELY_AI') {
    statusColor = '#ef4444'; // red-500
    statusBg = 'bg-red-50 text-red-700';
    StatusIcon = ShieldAlert;
  } else if (result.verdict === 'LIKELY_REAL') {
    statusColor = '#10b981'; // green-500
    statusBg = 'bg-green-50 text-green-700';
    StatusIcon = ShieldCheck;
  } else {
    statusColor = '#f59e0b'; // amber-500
    statusBg = 'bg-amber-50 text-amber-700';
    StatusIcon = AlertTriangle;
  }

  const COLORS = [statusColor, '#e2e8f0'];

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Search className="w-6 h-6 text-slate-400" />
          Forensic Report
        </h2>
        <button
          onClick={onReset}
          className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <RotateCcw size={16} className="mr-2" />
          Analyze New Image
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image & Verdict */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
              {imageSrc && (
                <img 
                  src={imageSrc} 
                  alt="Analyzed content" 
                  className="w-full h-full object-contain"
                />
              )}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${statusBg}`}>
                <StatusIcon size={14} />
                {result.verdict.replace('_', ' ')}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">AI Probability Score</h3>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <span className="text-4xl font-bold text-slate-900" style={{ color: statusColor }}>
                  {result.isAiGenerated ? result.confidenceScore : 100 - result.confidenceScore}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {result.isAiGenerated ? 'Likelihood of AI' : 'Likelihood of Real'}
                </span>
              </div>
            </div>
            <p className="text-center text-slate-600 text-sm mt-[-20px]">
              The model is <strong className="text-slate-900">{result.confidenceScore}% confident</strong> in this verdict.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Analysis */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Reasoning */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Executive Summary</h3>
            <p className="text-slate-600 leading-relaxed">
              {result.reasoning}
            </p>
          </div>

          {/* Forensic Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailCard 
              icon={<Sun size={20} />} 
              title="Lighting & Shadows" 
              content={result.forensicDetails.lighting} 
            />
            <DetailCard 
              icon={<Eye size={20} />} 
              title="Anatomy & Structure" 
              content={result.forensicDetails.anatomy} 
            />
            <DetailCard 
              icon={<Fingerprint size={20} />} 
              title="Texture Analysis" 
              content={result.forensicDetails.textures} 
            />
            <DetailCard 
              icon={<ImageIcon size={20} />} 
              title="Background Coherence" 
              content={result.forensicDetails.background} 
            />
          </div>

          {/* Key Indicators */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Indicators</h3>
            <ul className="space-y-3">
              {result.keyIndicators.map((indicator, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{indicator}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

const DetailCard: React.FC<{ icon: React.ReactNode, title: string, content: string }> = ({ icon, title, content }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-3 text-slate-900">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-700">
        {icon}
      </div>
      <h4 className="font-semibold text-sm">{title}</h4>
    </div>
    <p className="text-sm text-slate-600 leading-relaxed">
      {content}
    </p>
  </div>
);
