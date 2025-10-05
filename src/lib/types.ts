export type AudiogramDataPoint = {
  frequency: number;
  decibel: number;
};

export type HearingTestResult = {
  id: string;
  timestamp: number;
  results: AudiogramDataPoint[];
};
