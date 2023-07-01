import { Injectable } from '@angular/core';
import { User, UserAuth } from '../interfaces/user-auth.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiPath = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  register(user: UserAuth) {
    return this.http.post(`${this.apiPath}/register`, user);
  }

  login(user: UserAuth) {
    return this.http.post(`${this.apiPath}/login`, user);
  }

  logout() {
    this.clearUserData();
    return this.http.get(`${this.apiPath}/logout`);
  }

  saveUserData(user: User) {
    localStorage.setItem('uuid', user.uuid);
    localStorage.setItem('user', user.email);
  }

  clearUserData() {
    localStorage.clear();
  }
}