export enum IslandState {
  IDLE = 'IDLE',
  MEDIA = 'MEDIA',
  CALL = 'CALL',
  TIMER = 'TIMER',
  GEMINI = 'GEMINI',
  CHARGING = 'CHARGING'
}

export interface Song {
  title: string;
  artist: string;
  cover: string;
}

export interface CallInfo {
  name: string;
  duration: string;
  avatar: string;
}

export interface GeminiState {
  status: 'idle' | 'listening' | 'thinking' | 'response';
  query: string;
  response: string;
}

export interface AppData {
  id: number;
  name: string;
  color: string;
  icon?: string;
}