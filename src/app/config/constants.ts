import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Constants {
  public readonly API_ENDPOINT: string = 'https://project-backend-dormitory.vercel.app';
}