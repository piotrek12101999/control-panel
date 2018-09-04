import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnProjectsComponent } from './own-projects.component';

describe('OwnProjectsComponent', () => {
  let component: OwnProjectsComponent;
  let fixture: ComponentFixture<OwnProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
