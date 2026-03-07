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

  loginWithGoogle() {
    window.location.href = this.constants.API_ENDPOINT + '/api/auth/google';
  }
}