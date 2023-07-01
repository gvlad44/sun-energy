import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private apiPath = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  getAddresses() {
    return this.http.get(`${this.apiPath}/address`);
  }
}
