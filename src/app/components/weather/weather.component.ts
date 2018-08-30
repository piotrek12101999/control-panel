import { Component, OnInit } from '@angular/core';
import { FormControl , Validators} from '@angular/forms';
import { WeatherService } from '../../services/weather-service/weather.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  public userCity: Observable<any>;
  public cityToCreate: FormControl = new FormControl(Validators.required);
  public cityToUpdate: FormControl = new FormControl(Validators.required);
  public hasCity;

  constructor(private _afs: AngularFirestore, private _authService: AuthService , public weahterService: WeatherService) {
  }

  addCity(): void {
    this._authService.user.subscribe(val => {
      this._afs.collection('users').doc(val.uid).collection('cities').doc('city').set({
        cityName: this.cityToCreate.value
      });
    });
    this.weahterService.initializeService();
    this.hasCity = true;
  }

  updateCity(): void {
    this._authService.user.subscribe(val => {
      this._afs.collection('users').doc(val.uid).collection('cities').doc('city').update({
        cityName: this.cityToUpdate.value
      });
      this.cityToUpdate.setValue('');
    });
    this.weahterService.initializeService();
    this.hasCity = true;
  }

  ngOnInit() {
    this._authService.user.subscribe(val => {
      this.userCity = this._afs.collection('users').doc(val.uid).collection('cities').doc('city').valueChanges();
      this.userCity.subscribe(data => {
        if (data.cityName === '') {
          this.hasCity = false;
        } else {
          this.hasCity = true;
          this.weahterService.initializeService();
        }
      });
    });
    this.cityToCreate.setValue('');
    this.cityToUpdate.setValue('');
  }
}
