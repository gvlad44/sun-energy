import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddressPayload } from '../interfaces/address.interface';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private apiPath = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  getAddresses() {
    return this.http.get(`${this.apiPath}/address`);
  }

  addAddress(payload: AddressPayload) {
    return this.http.post(`${this.apiPath}/address`, payload);
  }

  extendContract(id: string, newContractEndDate: string) {
    return this.http.patch(`${this.apiPath}/address/${id}`, {
      contractEndDate: newContractEndDate,
    });
  }

  deleteContract(id: string) {
    return this.http.delete(`${this.apiPath}/address/${id}`);
  }
}
