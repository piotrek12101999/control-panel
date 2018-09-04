import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth-service/auth.service';
import { fadeAnimation } from './animations/fade.animation';
import { UserDataService } from './services/user-data/user-data.service';
import { PageService } from './services/page-service/page.service';
import { InvitationService } from './services/invitation-service/invitation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})

export class AppComponent implements OnInit {

  constructor(public auth: AuthService, private _dataService: UserDataService, public pageService: PageService,
    public invitationsService: InvitationService) { }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  ngOnInit() {
    this._dataService.initalizeDataGet();
  }
}
