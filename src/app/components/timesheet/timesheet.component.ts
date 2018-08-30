import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TimesheetService } from './../../services/timesheet-service/timesheet.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { PageService } from '../../services/page-service/page.service';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit, OnDestroy {

  public showForm: boolean;
  public startClicked: boolean;
  public week1Clicked: boolean;
  public week2Clicked: boolean;
  public week3Clicked: boolean;
  public week4Clicked: boolean;
  public week5Clicked: boolean;
  public monthForm: FormControl = new FormControl(Validators.required);
  public monthsForForm: Array<string>;

  constructor(public timesheetService: TimesheetService, private _authService: AuthService, private _pageService: PageService) {
  }

  public buttonClicked(): void {
    this.startClicked = !this.startClicked;
  }

  public monthChangeClick(): void {
    this.showForm = !this.showForm;
  }

  public week1Click(): void {
    this.week1Clicked = !this.week1Clicked;
  }

  public week2Click(): void {
    this.week2Clicked = !this.week2Clicked;
  }

  public week3Click(): void {
    this.week3Clicked = !this.week3Clicked;
  }
  public week4Click(): void {
    this.week4Clicked = !this.week4Clicked;
  }

  public week5Click(): void {
    this.week5Clicked = !this.week5Clicked;
  }

  ngOnInit() {
    this._authService.hideLoginComponent();
    this._pageService.timesheetSelected = true;
    this._pageService.homeSelected = false;
    this.showForm = false;
    this.startClicked = true;
    this.monthsForForm = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
    this.monthForm.setValue(this.monthsForForm[new Date().getMonth()]);
  }

  ngOnDestroy() {
    this._pageService.timesheetSelected = false;
    this._pageService.checkChange();
  }

}
