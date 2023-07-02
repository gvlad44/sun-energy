export interface Bill {
  uuid: string;
  consumed: number;
  produced: number;
  rate: number;
  total: number;
  dateBilled: string;
  createdAt: string;
  userid: string;
  addressid: string;
  isPaid: boolean;
}

export interface BillResponse {
  results: Bill[];
}
