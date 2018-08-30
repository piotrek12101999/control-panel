import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

const API_URL = environment.weatherApi;
const APP_ID = environment.weatherApiAppID;

@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {


  constructor(private http: HttpClient) {}

  public getWeather(city): Observable<any> {
    return this.http.get(API_URL + city + APP_ID).pipe(
      catchError(err => {
        return throwError('Get weather failed with: ' + JSON.stringify(err));
      }),
      map((data: any) => {
        return data;
      })
    );
  }
}
