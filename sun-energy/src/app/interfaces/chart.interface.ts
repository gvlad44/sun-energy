export interface ChartData {
  labels: string[];
  data: ChartSeries[];
}

interface ChartSeries {
  name: string;
  values: number[];
}
