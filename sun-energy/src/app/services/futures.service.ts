import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FuturePayload } from '../interfaces/futures.interface';

@Injectable({ providedIn: 'root' })
export class FuturesService {
  private apiPath = 'http://localhost:3001/api/futures';

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
}
