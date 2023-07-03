export interface Bill {
  id: string;
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

export interface PaymentPayload {
  billId: string;
  total: number;
  text: string;
  addressId: string;
}

export interface PaymentResponse {
  result: { url: string };
}
