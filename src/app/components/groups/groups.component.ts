import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PageService } from '../../services/page-service/page.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { GroupService } from '../../services/group-service/group.service';
import { ProjectsService } from '../../services/projects-service/projects.service';
import { InvitationService } from '../../services/invitation-service/invitation.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {

  public groupName: FormControl = new FormControl(Validators.required);
  public groupDesc: FormControl = new FormControl(Validators.required);
  public invitationEmail: FormControl = new FormControl(Validators.required);
  public invitationRights: FormControl = new FormControl(Validators.required);
  public invitationGroup: FormControl = new FormControl(Validators.required);
  public showForm: boolean;

  constructor(private _pageService: PageService, private _authService: AuthService, public groupService: GroupService,
  public projectsService: ProjectsService, public invitationService: InvitationService) { }

  public triggerForm(): void {
    this.showForm = !this.showForm;
  }

  public cleanForm(): void {
    this.groupName.setValue(undefined);
    this.groupDesc.setValue(undefined);
    this.invitationEmail.setValue(undefined);
  }

  ngOnInit() {
    this.showForm = false;
    this._authService.hideLoginComponent();
    this._pageService.groupSelcted = true;
    this._pageService.homeSelected = false;
    this.groupName.setValue(undefined);
    this.groupDesc.setValue(undefined);
    this.invitationEmail.setValue(undefined);
    this.invitationRights.setValue(undefined);
    this.invitationGroup.setValue(undefined);
  }

  ngOnDestroy() {
    this._pageService.groupSelcted = false;
    this._pageService.checkChange();
  }

}
