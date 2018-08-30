import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../auth-service/auth.service';
import { TimesheetData } from '../../models/timesheet.model';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  date: Date;
  monthToWatch: string;
  monthNames: Array<string>;
  daysNames: Array<string>;
  timesheetCollection: any;
  timesheets: Observable<TimesheetData[]>;
  timesheetHoursCalculation: Observable<TimesheetData[]>;
  clickDoc: AngularFirestoreDocument;
  click: Subscription;
  startClicked: boolean;
  week1Hours: number;
  week2Hours: number;
  week3Hours: number;
  week4Hours: number;
  week5Hours: number;
  week1Minutes: number;
  week2Minutes: number;
  week3Minutes: number;
  week4Minutes: number;
  week5Minutes: number;

  constructor(private _afs: AngularFirestore, private _authService: AuthService) {
    this.week1Hours = 0;
    this.week1Minutes = 0;
    this.week2Hours = 0;
    this.week2Minutes = 0;
    this.week3Hours = 0;
    this.week3Minutes = 0;
    this.week4Hours = 0;
    this.week4Minutes = 0;
    this.week5Hours = 0;
    this.week5Minutes = 0;
    this.date = new Date();
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    this.daysNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.monthToWatch = this.monthNames[this.date.getMonth()];
    this._authService.user.subscribe(data => {
      this.timesheetCollection = this._afs.collection('users').doc(data.uid).collection('timesheet').
      doc(this.monthToWatch).collection('days');
      this.timesheets = this.timesheetCollection.valueChanges();
      this.clickDoc = this._afs.collection('users').doc(data.uid).collection('timesheet').doc('click');
      this.click = this.clickDoc.valueChanges().subscribe(val => {
        this.startClicked = val.clicked;
      });
      this.checkIfExist();
      this.calculateHours();
    });
  }

  changeMonth(newMonth: string): void {
    this.monthToWatch = newMonth;
    this._authService.user.subscribe(data => {
      this.timesheetCollection = this._afs.collection('users').doc(data.uid).collection('timesheet').
      doc(this.monthToWatch).collection('days');
      this.timesheets = this.timesheetCollection.valueChanges();
      this.checkIfExist();
      this.calculateHours();
    });
  }

  calculateHours(): void {
    this.timesheetHoursCalculation = this.timesheetCollection.valueChanges();
    this.timesheetHoursCalculation.subscribe(val => {
      this.week1Hours = 0;
      this.week1Minutes = 0;
      this.week2Hours = 0;
      this.week2Minutes = 0;
      this.week3Hours = 0;
      this.week3Minutes = 0;
      this.week4Hours = 0;
      this.week4Minutes = 0;
      this.week5Hours = 0;
      this.week5Minutes = 0;
      for (let i = 0; i < val.length; i++) {

        if (val[i].weekOfMonth === 1) {
          this.week1Hours += val[i].sumOfHours;
          this.week1Minutes += val[i].sumOfMinutes;
          if (this.week1Minutes > 60) {
            this.week1Hours++;
            this.week1Minutes = this.week4Minutes - 60;
          }
        } else if (val[i].weekOfMonth === 2) {
          this.week2Hours += val[i].sumOfHours;
          this.week2Minutes += val[i].sumOfMinutes;
          if (this.week2Minutes > 60) {
            this.week2Hours++;
            this.week2Minutes = this.week4Minutes - 60;
          }
        } else if (val[i].weekOfMonth === 3) {
          this.week3Hours += val[i].sumOfHours;
          this.week3Minutes += val[i].sumOfMinutes;
          if (this.week3Minutes > 60) {
            this.week3Hours++;
            this.week3Minutes = this.week4Minutes - 60;
          }
        } else if (val[i].weekOfMonth === 4) {
          this.week4Hours += val[i].sumOfHours;
          this.week4Minutes += val[i].sumOfMinutes;
          if (this.week4Minutes > 60) {
            this.week4Hours++;
            this.week4Minutes = this.week4Minutes - 60;
          }
        } else if (val[i].weekOfMonth === 5) {
          this.week5Hours += val[i].sumOfHours;
          this.week5Minutes += val[i].sumOfMinutes;
          if (this.week5Minutes > 60) {
            this.week5Hours++;
            this.week5Minutes = this.week4Minutes - 60;
          }
        }
      }
    });
  }


  checkIfExist(): void {
    if (this.monthToWatch === this.monthNames[new Date().getMonth()]) {
      this.timesheetCollection.doc(`${this.date.getDate()}`).valueChanges().subscribe(val => {
        if (val === undefined) {
          this.timesheetCollection.doc(`${this.date.getDate()}`).set({
            day: this.date.getDate(),
            workHours: [],
            nameOfTheDay: this.daysNames[new Date().getDay()],
            weekOfMonth: Math.ceil(moment().week() - this.date.getMonth() * 4.4),
            month: this.monthNames[this.date.getMonth()],
            sumOfHours: 0,
            sumOfMinutes: 0
          });
        }
      });
    }
  }

  addWorkHours(): void {
    this.timesheetCollection.doc(`${this.date.getDate()}`).update({
      workHours: firebase.firestore.FieldValue.arrayUnion({
        hour: new Date().getHours(),
        minute: new Date().getMinutes()
      })
    });
    this.clickDoc.update({
      clicked: true
    });
  }

  stopWork(): void {
    this.timesheetCollection.doc(`${this.date.getDate()}`).update({
      workHours: firebase.firestore.FieldValue.arrayUnion({
        hour: new Date().getHours(),
        minute: new Date().getMinutes()
      })
    });

    this.clickDoc.update({
      clicked: false
    });

    this.timesheetCollection.doc(`${this.date.getDate()}`).valueChanges().subscribe(val => {
      let sumOfHours = 0;
      let sumOfMinutes = 0;
      for (let i = val.workHours.length; i > 0; i--) {
        if ((i - 1) % 2 === 0) {
          sumOfHours += val.workHours[i].hour - val.workHours[i - 1].hour;
          sumOfMinutes += val.workHours[i].minute - val.workHours[i - 1].minute;
          if (sumOfMinutes < 0) {
            sumOfHours--;
            sumOfMinutes = 60 + sumOfMinutes;
          }
        }
      }
      this.timesheetCollection.doc(`${this.date.getDate()}`).update({
        sumOfHours: sumOfHours,
        sumOfMinutes: sumOfMinutes
      });
    });
  }
}
