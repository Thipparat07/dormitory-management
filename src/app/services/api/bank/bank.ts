import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../../../config/constants';

export interface BankPayload {
  dormitory_id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
}

export interface BankResponse {
  status: string;
  message?: {
    th?: string;
    en?: string;
  } | string;
  timestamp?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class Bank {
  private constants = inject(Constants);
  private http = inject(HttpClient);

  getBanks(dormitoryId: number) {
    return this.http.get<any>(`${this.constants.API_ENDPOINT}/api/banks/${dormitoryId}`, { withCredentials: true });
  }

  createBank(payload: BankPayload): Observable<BankResponse> {
    return this.http.post<BankResponse>(
      `${this.constants.API_ENDPOINT}/api/banks`,
      payload,
      { withCredentials: true }
    );
  }

  updateBank(bankId: number, payload: Partial<BankPayload>): Observable<BankResponse> {
    return this.http.put<BankResponse>(
      `${this.constants.API_ENDPOINT}/api/banks/${bankId}`,
      payload,
      { withCredentials: true }
    );
  }

  deleteBank(bankId: number): Observable<BankResponse> {
    return this.http.delete<BankResponse>(
      `${this.constants.API_ENDPOINT}/api/banks/${bankId}`,
      { withCredentials: true }
    );
  }
}
