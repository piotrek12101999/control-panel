import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CalendarService } from '../../services/calendar-service/calendar.service';
import { ProjectsService } from '../../services/projects-service/projects.service';
import { TaskService } from '../../services/task-service/task.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { PageService } from '../../services/page-service/page.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  private _months: Array<string>;
  public date: Date;
  public monthIndex: number;
  public currentMonthOnCalendar: string;
  public showFormClicked: boolean;
  public eventInfoName: string;
  public dayName: number;
  public eventNameToShow: string;
  public eventDescToShow: string;
  public eventTypeToShow: string;
  public eventName: FormControl = new FormControl(Validators.required);
  public eventDesc: FormControl = new FormControl(Validators.required);
  public eventType: FormControl = new FormControl(Validators.required);
  public eventDate: FormControl = new FormControl(Validators.required);

  constructor(public calendarService: CalendarService, public projectsService: ProjectsService, public taskService: TaskService,
  private _authService: AuthService, private _pageService: PageService) {
  }

  public showForm(): void {
    this.showFormClicked = !this.showFormClicked;
  }

  public clickEvent(name: string, day: number, desc: string, type: string): void {
    this.eventInfoName = name;
    this.dayName = day;
    this.eventNameToShow = name;
    this.eventDescToShow = desc;
    this.eventTypeToShow = type;
  }

  public closeEventInfo(): void {
    this.eventInfoName = '';
  }

  public monthBack(monthIndex: number): void {
    if (monthIndex > -1) {
      this.monthIndex = monthIndex;
      this.currentMonthOnCalendar = this._months[monthIndex];
      this.calendarService.monthIndex = this.monthIndex;
      this.calendarService.getData();
    }
  }

  public monthNext(monthIndex: number): void {
    if (monthIndex < 12) {
      this.monthIndex = monthIndex;
      this.currentMonthOnCalendar = this._months[monthIndex];
      this.calendarService.monthIndex = this.monthIndex;
      this.calendarService.getData();
    }
  }

  public cleanForm(): void {
    this.eventName.setValue(undefined);
    this.eventDesc.setValue(undefined);
    this.eventType.setValue(undefined);
    this.eventDate.setValue(undefined);
  }

  ngOnInit() {
    this._authService.hideLoginComponent();
    this._pageService.calendarSelected = true;
    this._pageService.homeSelected = false;
    this.date = new Date();
    this._months = ['January', 'February', 'March', 'April', 'May', 'June'
      , 'July', 'August', 'September', 'October', 'November', 'December'];
    this.monthIndex = new Date().getMonth();
    this.calendarService.monthIndex = this.monthIndex;
    this.currentMonthOnCalendar = this._months[new Date().getMonth()];
    this.calendarService.getData();
    this.eventName.setValue(undefined);
    this.eventDesc.setValue(undefined);
    this.eventType.setValue(undefined);
    this.eventDate.setValue(undefined);
  }

  ngOnDestroy() {
    this._pageService.calendarSelected = false;
    this._pageService.checkChange();
  }
}
