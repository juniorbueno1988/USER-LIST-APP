import { Component } from '@angular/core';
import { UserList } from './features/users/user-list/user-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserList],
  template: `<app-user-list></app-user-list>`
})
export class App {}