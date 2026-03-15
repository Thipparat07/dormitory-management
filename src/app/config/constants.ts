import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class Constants {
  public readonly API_ENDPOINT: string = environment.apiEndpoint;
}