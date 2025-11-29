export enum AnalysisStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface ForensicDetails {
  lighting: string;
  anatomy: string;
  textures: string;
  background: string;
}

export interface AnalysisResult {
  isAiGenerated: boolean;
  confidenceScore: number; // 0 to 100
  verdict: 'LIKELY_REAL' | 'LIKELY_AI' | 'UNCERTAIN';
  forensicDetails: ForensicDetails;
  keyIndicators: string[];
  reasoning: string;
}

export interface DragDropProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

export interface ResultDashboardProps {
  result: AnalysisResult;
  imageSrc: string | null;
  onReset: () => void;
}
