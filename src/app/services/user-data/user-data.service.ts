import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../auth-service/auth.service';
import { WeatherApiService } from '../weather-api/weather-api.service';
import { TimesheetService } from './../timesheet-service/timesheet.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  public city;
  public cityExist = false;
  public todos;
  public todosExist = false;
  public projects;
  public projectsExist = false;
  public timesheetClick;
  public timesheetMonth;
  public timesheetExist = false;
  public tasks;
  public tasksExist = false;
  public calendar;
  public calendarExists = false;

  constructor(private afs: AngularFirestore, public authService: AuthService, public weatherAPI: WeatherApiService,
    public timesheetService: TimesheetService) {
  }

  public initalizeDataGet() {
    this.authService.user.subscribe(data => {
      this.checkIfCityExist(data);
      this.checkIfTodosExist(data);
      this.checkIfProjectsExist(data);
      this.checkIfTimesheetExist(data);
      this.checkIfTasksExist(data);
      this.checkIfCalendarExist(data);
    });
  }

  public checkIfCityExist(user) {
    this.city = this.afs.collection('users').doc(user.uid).collection('cities').valueChanges();
    this.city.subscribe(val => {
      if (val.length > 0) {
        this.cityExist = true;
      } else {
        this.cityExist = false;
      }
    });
  }

  public checkIfTodosExist(user) {
    this.todos = this.afs.collection('users').doc(user.uid).collection('todos').valueChanges();
    this.todos.subscribe(val => {
      if (val.length > 0) {
        this.todosExist = true;
      } else {
        this.todosExist = false;
      }
    });
  }

  public checkIfProjectsExist(user) {
    this.projects = this.afs.collection('users').doc(user.uid).collection('projects').valueChanges();
    this.projects.subscribe(val => {
      if (val.length > 0) {
        this.projectsExist = true;
      } else {
        this.projectsExist = false;
      }
    });
  }

  public checkIfTimesheetExist(user) {
    this.timesheetClick = this.afs.collection('users').doc(user.uid).collection('timesheet').doc('click').valueChanges();
    this.timesheetClick.subscribe(val => {
      if (val === undefined) {
        this.afs.collection('users').doc(user.uid).collection('timesheet').doc('click').set({
          clicked: false
        });
      }
      this.timesheetMonth = this.afs.collection('users').
      doc(user.uid).collection('timesheet').doc(this.timesheetService.monthToWatch).valueChanges();
      this.timesheetMonth.subscribe(data => {
        if (data === undefined) {
          this.afs.collection('users').doc(user.uid).collection('timesheet').doc(this.timesheetService.monthToWatch).set({
            monthName: this.timesheetService.monthToWatch
          });
        }
      });
    });
  }

  public checkIfTasksExist(user) {
    this.tasks = this.afs.collection('users').doc(user.uid).collection('tasks').valueChanges();
    this.tasks.subscribe(val => {
      if (val.length > 0) {
        this.tasksExist = true;
      } else {
        this.tasksExist = false;
      }
    });
  }

  public checkIfCalendarExist(user) {
    this.calendar = this.afs.collection('users').doc(user.uid).collection('calendar').valueChanges();
    this.calendar.subscribe(val => {
      if (val.length > 0) {
        this.calendarExists = true;
      } else {
        this.calendarExists = false;
      }
    });
  }
}
