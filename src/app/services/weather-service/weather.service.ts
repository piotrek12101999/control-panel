import { Injectable } from '@angular/core';
import { WeatherApiService } from '../weather-api/weather-api.service';
import { AuthService } from '../auth-service/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  public userCityName: Observable<any>;
  public weatherData$: Observable<any>;
  public city$: Observable<string>;
  public date$: Observable<Date>;
  public weatherDescription$: Observable<string>;
  public temperature$: Observable<number>;
  public wind$: Observable<number>;
  public icon$: Observable<string>;

  constructor(private _afs: AngularFirestore, private _authService: AuthService, private _weatherAPI: WeatherApiService) {
  }

  getCity(): void {
    this.city$ = this.weatherData$.pipe(
      map(data => {
        return data.city.name;
      })
    );
  }

  getDate(): void {
    this.date$ = this.weatherData$.pipe(
      map(data => {
          return data.list[0].dt_txt;
      })
    );
  }

  getWeatherDescription(): void {
    this.weatherDescription$ = this.weatherData$.pipe(
      map(data => {
        return data.list[0].weather[0].description;
      })
    );
  }

  getTemperature(): void {
    this.temperature$ = this.weatherData$.pipe(
      map(data => {
        return data.list[0].main.temp;
      })
    );
  }

  getWind(): void {
    this.wind$ = this.weatherData$.pipe(
      map(data => {
        return data.list[0].wind.speed;
      })
    );
  }

  getIcon(): void {
    this.icon$ = this.weatherData$.pipe(
      map(data => {
        return data.list[0].weather[0].icon;
      })
    );
  }

  getData(): void {
    this.getCity();
    this.getDate();
    this.getWeatherDescription();
    this.getTemperature();
    this.getWind();
    this.getIcon();
  }

  initializeService(): void {
    this._authService.user.subscribe(val => {
      this.userCityName = this._afs.collection('users').doc(val.uid).collection('cities').doc('city').valueChanges();
      this.userCityName.subscribe(data => {
        this.weatherData$ = this._weatherAPI.getWeather(data.cityName);
        this.getData();
      });
    });
  }
}
