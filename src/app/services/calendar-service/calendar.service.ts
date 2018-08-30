import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { CalendarData } from '../../models/calendar.model';
import { AuthService } from './../auth-service/auth.service';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private _date: Date;
  private _days: Array<string>;
  private _calendarCollection: AngularFirestoreCollection<CalendarData>;
  public monthIndex: number;
  public numberDaysInMonth: Array<number>;
  public namesDaysInMonth: Array<string>;
  public firstDaysInMonth: Array<number>;
  public lastDaysInMonth: Array<number>;
  public calendarDates: Observable<CalendarData[]>;

  constructor(private _afs: AngularFirestore, private _authService: AuthService) {
    this._date = new Date();
    this._days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this._authService.user.subscribe(data => {
      this._calendarCollection = this._afs.collection('users').doc(data.uid).collection('calendar');
      this.calendarDates = this._calendarCollection.valueChanges();
    });
  }

  public getData(): void {
    this._getDaysInCertainMonth(this.monthIndex);
    this._getDaysNamesInCertainMonth(this.monthIndex);
    this._getPreviousMonthDays(this.monthIndex);
    this._getNextMonthDays(this.monthIndex);
  }

  public addCalendarEvent(date: string, eventName: string, eventDesc: string, eventType: string,
    projectID?: string): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    let day = date.substring(8, 10);
    const month = date.charAt(6);
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (day.charAt(0) === '0') {
      day = day.charAt(1);
    }
    if (projectID !== undefined) {
      this._calendarCollection.doc(projectID).set({
        day: +day,
        month: +month,
        events: firebase.firestore.FieldValue.arrayUnion({
          eventName: eventName,
          eventDesc: eventDesc,
          eventType: eventType
        }),
        projectID: projectID,
        ID: projectID
      });
    } else {
      this._calendarCollection.doc(autoId).set({
        day: +day,
        month: +month,
        events: firebase.firestore.FieldValue.arrayUnion({
          eventName: eventName,
          eventDesc: eventDesc,
          eventType: eventType
        }),
        ID: autoId
      });
    }
  }

  public deleteEvent(ID: string): void {
    this._calendarCollection.doc(ID).delete();
  }

  private _getDaysInCertainMonth(monthIndex: number): void {
    this.numberDaysInMonth = [];
    for (let i = 1; i <= new Date(this._date.getFullYear(), monthIndex + 1, 0).getDate(); i++) {
      this.numberDaysInMonth.push(i);
    }
  }

  private _getDaysNamesInCertainMonth(monthIndex: number): void {
    this.namesDaysInMonth = [];
    for (let i = 1; i <= new Date(this._date.getFullYear(), monthIndex + 1, 0).getDate(); i++) {
      this.namesDaysInMonth.push(this._days[new Date(this._date.getFullYear(), monthIndex, i).getDay()]);
    }
  }

  private _getPreviousMonthDays(monthIndex: number): void {
    this.firstDaysInMonth = [];
    switch (this.namesDaysInMonth[0]) {
      case 'Tuesday':
        for (let i = new Date(this._date.getFullYear(), monthIndex, 0).getDate();
          i < new Date(this._date.getFullYear(), monthIndex, 0).getDate() + 1; i++) {
          this.firstDaysInMonth.push(i);
        }
        break;

      case 'Wednesday':
        for (let i = new Date(this._date.getFullYear(), monthIndex, 0).getDate() - 1;
          i < new Date(this._date.getFullYear(), monthIndex, 0).getDate() + 1; i++) {
          this.firstDaysInMonth.push(i);
        }
        break;

      case 'Thursday':
        for (let i = new Date(this._date.getFullYear(), monthIndex, 0).getDate() - 2;
          i < new Date(this._date.getFullYear(), monthIndex, 0).getDate() + 1; i++) {
          this.firstDaysInMonth.push(i);
        }
        break;

      case 'Friday':
        for (let i = new Date(this._date.getFullYear(), monthIndex, 0).getDate() - 3;
          i < new Date(this._date.getFullYear(), monthIndex, 0).getDate() + 1; i++) {
          this.firstDaysInMonth.push(i);
        }
        break;

      case 'Saturday':
        for (let i = new Date(this._date.getFullYear(), monthIndex, 0).getDate() - 4;
          i < new Date(this._date.getFullYear(), monthIndex, 0).getDate() + 1; i++) {
          this.firstDaysInMonth.push(i);
        }
        break;

      case 'Sunday':
        for (let i = new Date(this._date.getFullYear(), monthIndex, 0).getDate() - 5;
          i < new Date(this._date.getFullYear(), monthIndex, 0).getDate() + 1; i++) {
          this.firstDaysInMonth.push(i);
        }
        break;

      default:
        this.firstDaysInMonth = [];
        break;
    }
  }

  private _getNextMonthDays(monthIndex: number): void {
    this.lastDaysInMonth = [];
    switch (this.namesDaysInMonth[new Date(this._date.getFullYear(), monthIndex + 1, 0).getDate() - 1]) {
      case 'Monday':
        this.lastDaysInMonth.push(1, 2, 3, 4, 5, 6);
        break;
      case 'Tuesday':
        this.lastDaysInMonth.push(1, 2, 3, 4, 5);
        break;
      case 'Wednesday':
        this.lastDaysInMonth.push(1, 2, 3, 4);
        break;
      case 'Thursday':
        this.lastDaysInMonth.push(1, 2, 3);
        break;
      case 'Friday':
        this.lastDaysInMonth.push(1, 2);
        break;
      case 'Saturday':
        this.lastDaysInMonth.push(1);
        break;
      default:
        this.lastDaysInMonth = [];
        break;
    }
  }
}
