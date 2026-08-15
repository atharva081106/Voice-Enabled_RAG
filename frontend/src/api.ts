export interface LatencyMetrics {
  stt: number;
  retrieval: number;
  reranking: number;
  generation: number;
  verification: number;
  total: number;
}

export interface Source {
  chunk_id: string;
  text: string;
  metadata: Record<string, any>;
  score: number;
}

export interface FinalResponse {
  request_id: string;
  transcript: string;
  answer: string;
  sources: Source[];
  grounded: boolean;
  refused: boolean;
  refusal_reason: string | null;
  latency_ms: LatencyMetrics;
}

export interface HealthResponse {
  status: string;
  vector_db: string;
  model: string;
  stt: string;
}

export const checkHealth = async (): Promise<HealthResponse> => {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error('Network error');
  return res.json();
};

export const submitVoiceQuery = async (audioBlob: Blob): Promise<FinalResponse> => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${API_BASE}/api/voice/query`, {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to process voice query');
  }
  
  return res.json();
};

export const submitTextRetrieval = async (query: string, limit: number = 5): Promise<Source[]> => {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${API_BASE}/api/text/retrieve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, limit }),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to retrieve text chunks');
  }
  
  const data = await res.json();
  return data.results;
};

// Profile API
export const getProfile = async () => {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${API_BASE}/api/profile`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export const updateProfile = async (data: any) => {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${API_BASE}/api/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
};

// Settings API
export const getSettings = async () => {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${API_BASE}/api/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
};

export const updateSettings = async (data: any) => {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${API_BASE}/api/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
};

// Support API
export const submitSupportTicket = async (data: any) => {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${API_BASE}/api/support`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit ticket');
  return res.json();
};
