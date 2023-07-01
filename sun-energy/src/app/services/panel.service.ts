import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PanelService {
  private apiPath = 'http://localhost:3001/api/panel';

  constructor(private http: HttpClient) {}

  getPanels(addressId: string) {
    return this.http.get(`${this.apiPath}/address/${addressId}`);
  }

  getPanel(panelId: string) {
    return this.http.get(`${this.apiPath}/${panelId}`);
  }
}
