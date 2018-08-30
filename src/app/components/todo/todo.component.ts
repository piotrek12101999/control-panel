import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { AngularFirestore , AngularFirestoreCollection } from 'angularfire2/firestore';
import { TodoData } from '../../models/todo.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  public taskName: FormControl = new FormControl(Validators.required);
  public tasksImportanceValues: Array<any> = [
    { value: '!' , text: '!'},
    { value: '!!' , text: '!!'},
    { value: '!!!' , text: '!!!'},
    { value: '!!!!' , text: '!!!!'}
  ];
  public taskImportance: FormControl = new FormControl();
  public hasAddedTodos: boolean;
  public todosCollection: AngularFirestoreCollection<TodoData>;
  public todos: Observable<TodoData[]>;

  constructor(private _afs: AngularFirestore, private _authService: AuthService) { }

  public sortTodos(): void {
    this._authService.user.subscribe(val => {
      this.todosCollection = this._afs.collection('users').doc(val.uid).collection('todos', ref => {
        return ref.orderBy('todoImportance', 'desc');
      });
      this.todos = this.todosCollection.valueChanges();
    });
  }

  public addTodo(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let autoId = '';
      for (let i = 0; i < 20; i++) {
        autoId += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    this.todosCollection.doc(autoId).set({
      todoName: this.taskName.value,
      todoImportance: this.taskImportance.value,
      todoID: autoId
    });
    this.taskName.setValue('');
    this.taskImportance.setValue('1');
  }

  public deleteTodo(todo: TodoData): void {
    this.todosCollection.doc(todo.todoID).delete();
    this.todos.subscribe(val => {
      if (val.length === 0) {
        this.hasAddedTodos = false;
      }
    });
  }

  ngOnInit() {
    this.hasAddedTodos = false;
    this.taskName.setValue('');
    this.taskImportance.setValue('1');
    this._authService.user.subscribe(val => {
      this.todosCollection = this._afs.collection('users').doc(val.uid).collection('todos', ref => {
        return ref;
      });
      this.todos = this.todosCollection.valueChanges();
      this.todos.subscribe(data => {
        if (data.length > 0 ) {
          this.hasAddedTodos = true;
        }
      });
    });
  }

}
