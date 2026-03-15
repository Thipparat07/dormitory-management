import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../../../config/constants';

export interface CreateDormitoryPayload {
  name: string;
  phone: string;
  address: string;
  bill_generation_day: number;
  bill_due_date: number;
  billing_type: string;
  bill_delivery_mode: string;
  number_of_floors: number;
  rooms_per_floor: number;
}

export interface DormitoryResponse {
  status: string;
  message: {
    th: string;
    en: string;
  };
  timestamp: string;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class Dormitory {
  private constants = inject(Constants);
  private http = inject(HttpClient);

  createDormitory(payload: CreateDormitoryPayload): Observable<DormitoryResponse> {
    return this.http.post<DormitoryResponse>(
      this.constants.API_ENDPOINT + '/api/dormitories',
      payload,
      { withCredentials: true }
    );
  }

  getMyDormitories(): Observable<DormitoryResponse> {
    return this.http.get<DormitoryResponse>(
      this.constants.API_ENDPOINT + '/api/dormitories',
      { withCredentials: true }
    );
  }

  getDormitoryById(dormitoryId: number | string): Observable<DormitoryResponse> {
    return this.http.get<DormitoryResponse>(
      `${this.constants.API_ENDPOINT}/api/dormitories/${dormitoryId}`,
      { withCredentials: true }
    );
  }

  getRooms(dormitoryId: number): Observable<any> {
    return this.http.get<any>(
      `${this.constants.API_ENDPOINT}/api/dormitories/${dormitoryId}/rooms`,
      { withCredentials: true }
    );
  }

  getRoomTypes(dormitoryId: number): Observable<any> {
    return this.http.get<any>(
      `${this.constants.API_ENDPOINT}/api/dormitories/${dormitoryId}/room-types`,
      { withCredentials: true }
    );
  }

  assignRoomType(dormitoryId: number, roomIds: number[], roomTypeId: number): Observable<any> {
    return this.http.put<any>(
      `${this.constants.API_ENDPOINT}/api/dormitories/${dormitoryId}/rooms/assign-type`,
      { room_ids: roomIds, room_type_id: roomTypeId },
      { withCredentials: true }
    );
  }

  createRoomType(dormitoryId: number, payload: { name: string, price: number }): Observable<any> {
    return this.http.post<any>(
      `${this.constants.API_ENDPOINT}/api/dormitories/${dormitoryId}/room-types`,
      payload,
      { withCredentials: true }
    );
  }

  updateRoomType(dormitoryId: number, roomTypeId: number, payload: { name: string, price: number }): Observable<any> {
    return this.http.put<any>(
      `${this.constants.API_ENDPOINT}/api/dormitories/${dormitoryId}/room-types/${roomTypeId}`,
      payload,
      { withCredentials: true }
    );
  }

  deleteRoomType(dormitoryId: number, roomTypeId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.constants.API_ENDPOINT}/api/dormitories/${dormitoryId}/room-types/${roomTypeId}`,
      { withCredentials: true }
    );
  }
}
