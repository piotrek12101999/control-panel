import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PageService } from '../../services/page-service/page.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { GroupService } from '../../services/group-service/group.service';
import { ProjectsService } from '../../services/projects-service/projects.service';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {

  constructor(private _pageService: PageService, private _authService: AuthService, public groupService: GroupService,
  public projectsService: ProjectsService) { }

  ngOnInit() {
    this._authService.hideLoginComponent();
    this._pageService.groupSelcted = true;
    this._pageService.homeSelected = false;
  }

  ngOnDestroy() {
    this._pageService.groupSelcted = false;
    this._pageService.checkChange();
  }


}
