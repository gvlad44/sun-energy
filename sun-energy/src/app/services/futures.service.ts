import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FuturePayload } from '../interfaces/futures.interface';

@Injectable({ providedIn: 'root' })
export class FuturesService {
  private apiPath = 'http://localhost:3001/api/futures';
  private apiPathOther = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  listFuture(futurePayload: FuturePayload) {
    return this.http.post(`${this.apiPath}/sell`, futurePayload);
  }

  getUserListedFutures() {
    return this.http.get(`${this.apiPath}`);
  }

  getAddressListedFutures(id: string) {
    return this.http.get(`${this.apiPath}/${id}`);
  }

  getAvailableListings() {
    return this.http.get(`${this.apiPathOther}/available`);
  }

  getBoughtListings() {
    return this.http.get(`${this.apiPathOther}/bought`);
  }

  buyListedFuture(id: string, buyerAddressId: string) {
    return this.http.patch(`${this.apiPath}/${id}`, { buyerAddressId });
  }

  deleteListedFuture(id: string) {
    return this.http.delete(`${this.apiPath}/${id}`);
  }
}
