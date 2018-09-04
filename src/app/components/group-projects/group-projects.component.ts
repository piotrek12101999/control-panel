import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageService } from '../../services/page-service/page.service';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-group-projects',
  templateUrl: './group-projects.component.html',
  styleUrls: ['./group-projects.component.scss']
})
export class GroupProjectsComponent implements OnInit, OnDestroy {

  constructor(private _pageService: PageService, private _authService: AuthService) { }

  ngOnInit() {
    // this._authService.hideLoginComponent();
    // this._pageService.groupProjectsSeclected = true;
    // this._pageService.showProjectsSubcategory = true;
  }

  ngOnDestroy() {
    // this._pageService.groupProjectsSeclected = false;
    // this._pageService.showProjectsSubcategory = false;
    // this._pageService.checkChange();
  }

}
