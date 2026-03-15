import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../../../config/constants';

export interface Dormitory {
  id: number;
  name: string;
  address: string;
  phone: string;
  join_code: string;
  join_status: string;
  joined_at: string;
  room_number: string;
  floor_number: number;
  room_id: number;
}

export interface DormitoryResponse {
  status: string;
  message: {
    th: string;
    en: string;
  };
  timestamp: string;
  data: Dormitory[];
}

export interface JoinInfoRoom {
  id: number;
  room_number: string;
  floor_number: number;
  room_price: string;
  furniture_fee: string;
  status: string;
}

export interface JoinInfoData {
  dormitory: {
    id: number;
    name: string;
    address: string;
    phone: string;
  };
  rooms: JoinInfoRoom[];
  floors: number[];
}

export interface JoinInfoResponse {
  status: string;
  message: {
    th: string;
    en: string;
  };
  timestamp: string;
  data: JoinInfoData;
}

export interface MyDormitoryData {
  dormitory: {
    name: string;
    address: string;
    phone: string;
    bill_date: number;
  };
  room: {
    room_number: string;
    floor_number: number;
    price: number;
  };
  utilities: {
    water_rate: number;
    electricity_rate: number;
  };
  bank_accounts: {
    bank_name: string;
    account_number: string;
    account_name: string;
  }[];
}

export interface MyDormitoryResponse {
  status: string;
  message: {
    th: string;
    en: string;
  };
  timestamp: string;
  data: MyDormitoryData;
}

@Injectable({
  providedIn: 'root',
})
export class Tenant {
  private constants = inject(Constants);
  private http = inject(HttpClient);

  constructor() { }

  getMyDormitories(): Observable<DormitoryResponse> {
    return this.http.get<DormitoryResponse>(
      this.constants.API_ENDPOINT + '/api/tenants/my-dormitories',
      { withCredentials: true }
    );
  }

  getJoinInfo(joinCode: string): Observable<JoinInfoResponse> {
    return this.http.get<JoinInfoResponse>(
      this.constants.API_ENDPOINT + `/api/tenants/join-info?join_code=${joinCode}`,
      { withCredentials: true }
    );
  }

  joinDormitory(joinCode: string, roomId: number, profileData?: any): Observable<any> {
    return this.http.post<any>(
      this.constants.API_ENDPOINT + '/api/tenants/join',
      {
        join_code: joinCode,
        room_id: roomId,
        ...profileData
      },
      { withCredentials: true }
    );
  }

  getLatestProfile(): Observable<any> {
    return this.http.get<any>(
      this.constants.API_ENDPOINT + '/api/tenants/latest-profile',
      { withCredentials: true }
    );
  }

  getRoomDetail(dormId: number, roomId: number): Observable<any> {
    return this.http.get<any>(
      this.constants.API_ENDPOINT + `/api/tenants/${dormId}/rooms/${roomId}/details`,
      { withCredentials: true }
    );
  }

  approveRequest(dormId: number, tenantId: number, roomId: number): Observable<any> {
    return this.http.put<any>(
      this.constants.API_ENDPOINT + `/api/tenants/${dormId}/join-requests/${tenantId}/approve`,
      { room_id: roomId },
      { withCredentials: true }
    );
  }

  removeTenant(dormId: number, tenantId: number): Observable<any> {
    return this.http.delete<any>(
      this.constants.API_ENDPOINT + `/api/tenants/${dormId}/remove/${tenantId}`,
      { withCredentials: true }
    );
  }

  getMyDormitory(roomId?: number): Observable<MyDormitoryResponse> {
    const url = roomId
      ? this.constants.API_ENDPOINT + `/api/tenants/my-dormitory?room_id=${roomId}`
      : this.constants.API_ENDPOINT + '/api/tenants/my-dormitory';
    return this.http.get<MyDormitoryResponse>(url, { withCredentials: true });
  }

  updateTenantProfile(dormId: number, tenantId: number, profileData: any): Observable<any> {
    return this.http.put<any>(
      this.constants.API_ENDPOINT + `/api/tenants/${dormId}/update/${tenantId}`,
      profileData,
      { withCredentials: true }
    );
  }

  addTenant(dormId: number, profileData: any): Observable<any> {
    return this.http.post<any>(
      this.constants.API_ENDPOINT + `/api/tenants/${dormId}/add`,
      profileData,
      { withCredentials: true }
    );
  }

  searchUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(
      this.constants.API_ENDPOINT + `/api/tenants/search-user?email=${email}`,
      { withCredentials: true }
    );
  }
}
