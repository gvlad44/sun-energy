export interface Address {
  position: number;
  id: number;
  address: string;
  energy_rate: number;
  contract_start_date: string;
  contract_end_date: string;
}

export interface AddressResponse {
  results: Address[];
}
