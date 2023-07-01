export interface Future {
  id: string;
  quantity: number;
  rate: number;
  total: number;
  maturityDate: string;
  createdAt: string;
  userId: string;
  addressId: string;
  boughtAt: string;
  buyerId: string;
}

export interface FuturePayload {
  quantity: number;
  rate: number;
  maturityDate: number;
  addressId: string;
}

export interface FutureResponse {
  results: Future[];
}
