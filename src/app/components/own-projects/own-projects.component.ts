import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageService } from '../../services/page-service/page.service';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-own-projects',
  templateUrl: './own-projects.component.html',
  styleUrls: ['./own-projects.component.scss']
})
export class OwnProjectsComponent implements OnInit, OnDestroy {

  constructor(private _pageService: PageService, private _authService: AuthService) { }

  ngOnInit() {
    this._authService.hideLoginComponent();
    // this._authService.hideLoginComponent();
    // this._pageService.ownProjectsSelected = true;
    // this._pageService.showProjectsSubcategory = true;
  }

  ngOnDestroy() {
    // this._pageService.ownProjectsSelected = false;
    // this._pageService.showProjectsSubcategory = false;
    // this._pageService.checkChange();
  }

}
