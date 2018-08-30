import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  public homeSelected: boolean;
  public projectsSelected: boolean;
  public timesheetSelected: boolean;
  public tasksSelected: boolean;
  public calendarSelected: boolean;

  constructor() {
    this.homeSelected = true;
    this.projectsSelected = false;
    this.timesheetSelected = false;
    this.tasksSelected = false;
    this.calendarSelected = false;
  }

  public checkChange() {
    if (this.projectsSelected === false && this.timesheetSelected === false && this.tasksSelected === false &&
      this.tasksSelected === false && this.calendarSelected === false) {
      this.homeSelected = true;
    } else {
      this.homeSelected = false;
    }
  }
}
