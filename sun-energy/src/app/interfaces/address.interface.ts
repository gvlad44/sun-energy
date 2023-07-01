export interface Address {
  id: string;
  address: string;
  status: AddressStatus;
  rate: number;
  contractStartDate: string;
  contractEndDate: string;
  pod?: string;
  series?: string;
  index?: string;
  consumed?: ConsumedMetrics[];
}

export interface ConsumedMetrics {
  newIndex: number;
  timestamp: string;
}

export interface AddressResponse {
  results: Address[];
}

export interface AddressPayload {
  address: string;
  city: string;
  contractStartDate: string;
  contractEndDate: string;
  pod: string;
  series: string;
  index: string;
  userid: string;
}

export enum AddressStatus {
  ACTIVE = 'Active',
  DISABLED = 'Disabled',
  REQUESTED = 'Requested',
}
