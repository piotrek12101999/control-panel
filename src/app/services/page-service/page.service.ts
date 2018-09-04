import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  public homeSelected: boolean;
  public groupSelcted: boolean;
  public projectsSelected: boolean;
  public ownProjectsSelected: boolean;
  public groupProjectsSeclected: boolean;
  public timesheetSelected: boolean;
  public tasksSelected: boolean;
  public calendarSelected: boolean;
  public showProjectsSubcategory: boolean;

  constructor() {
    this.homeSelected = true;
    this.projectsSelected = false;
    this.showProjectsSubcategory = false;
    this.ownProjectsSelected = false;
    this.groupProjectsSeclected = false;
    this.timesheetSelected = false;
    this.tasksSelected = false;
    this.calendarSelected = false;
  }

  public projectsTabSelected(): void {
    this.showProjectsSubcategory = true;
  }

  public closeProjectsTabsSelected(): void {
    this.showProjectsSubcategory = false;
  }

  public selectOwnProjects(): void {
    this.showProjectsSubcategory = true;
    this.ownProjectsSelected = true;
    this.projectsSelected = false;
  }

  public selectGroupProjects(): void {
    this.showProjectsSubcategory = true;
    this.groupProjectsSeclected = true;
  }

  public checkChange() {
    if (this.projectsSelected === false && this.groupProjectsSeclected === false && this.timesheetSelected === false
      && this.ownProjectsSelected === false && this.groupProjectsSeclected === false && this.tasksSelected === false
      && this.tasksSelected === false && this.calendarSelected === false) {
      this.homeSelected = true;
    } else {
      this.homeSelected = false;
    }
  }
}
