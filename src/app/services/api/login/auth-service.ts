import { Injectable, inject } from '@angular/core';
import { Constants } from '../../../config/constants';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private constants = inject(Constants);
  private http = inject(HttpClient);

  login(email: string, password: string) {
    return this.http.post(
      this.constants.API_ENDPOINT + '/api/auth/login',
      { email, password }
    );
  }

  register(email: string, phone: string, password: string) {
    return this.http.post(
      this.constants.API_ENDPOINT + '/api/auth/register',
      { email, phone, password }
    );
  }

  logout() {
    return this.http.post(
      this.constants.API_ENDPOINT + '/api/auth/logout',
      {}
    );
  }

  loginWithGoogle() {
    window.location.href = this.constants.API_ENDPOINT + '/api/auth/google';
  }

  checkAuthStatus() {
    return this.http.get(
      this.constants.API_ENDPOINT + '/api/auth/me'
    );
  }

  confirmGoogleLink(token: string) {
    return this.http.post(
      this.constants.API_ENDPOINT + '/api/auth/google/link-confirm',
      { token }
    );
  }
}