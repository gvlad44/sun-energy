import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentPayload } from '../interfaces/bills.interface';

@Injectable({ providedIn: 'root' })
export class BillsService {
  private apiPath = 'http://localhost:3001/api/bills';

  constructor(private http: HttpClient) {}

  getBills(id: string) {
    return this.http.get(`${this.apiPath}/${id}`);
  }

  payBill(payload: PaymentPayload) {
    return this.http.post(`${this.apiPath}/pay`, payload);
  }
}
