export interface Address {
  id: number;
  address: string;
  status: AddressStatus;
  rate: number;
  contractStartDate: string;
  contractEndDate: string;
  pod?: string;
  series?: string;
  index?: string;
}

export interface AddressResponse {
  results: Address[];
}

export interface AddressPayload {
  address: string;
  contractStartDate: string;
  contractEndDate: string;
  pod: string;
  series: string;
  index: string;
}

export enum AddressStatus {
  ACTIVE = 'Active',
  DISABLED = 'Disabled',
  REQUESTED = 'Requested',
}
