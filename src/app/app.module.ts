import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { NgDragDropModule } from 'ng-drag-drop';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/auth.guard';

import { AppComponent } from './app.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { TodoComponent } from './components/todo/todo.component';
import { WeatherComponent } from './components/weather/weather.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ProjectComponent } from './components/project/project.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { TaskComponent } from './components/task/task.component';
import { OwnProjectsComponent } from './components/own-projects/own-projects.component';
import { GroupProjectsComponent } from './components/group-projects/group-projects.component';
import { GroupComponent } from './components/group/group.component';
import { GroupsComponent } from './components/groups/groups.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    LoginComponent,
    HomeComponent,
    TimesheetComponent,
    TodoComponent,
    WeatherComponent,
    TasksComponent,
    CalendarComponent,
    ProjectComponent,
    FileUploadComponent,
    TaskComponent,
    OwnProjectsComponent,
    GroupProjectsComponent,
    GroupComponent,
    GroupsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    CoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgDragDropModule.forRoot()
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
