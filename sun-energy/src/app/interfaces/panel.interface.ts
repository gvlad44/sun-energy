export interface Panel {
  id: string;
  name: string;
  output: number;
  metrics: PanelMetrics[];
  addressId: string;
  userId: string;
}

export interface PanelResponse {
  results: Panel[];
}

export interface PanelMetrics {
  produced: number;
  timestamp: string;
}
