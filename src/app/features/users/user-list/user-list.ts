import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user';
import { User } from '../../../core/models/user';
import { Subject, debounceTime, catchError, of } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.html'
})
export class UserList implements OnInit {

  private service = inject(UserService);

  users: User[] = [];
  filteredUsers: User[] = [];

  loading = false;
  error: string | null = null;

  private search$ = new Subject<string>();

  ngOnInit() {
    this.loadUsers();

    this.search$
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.filteredUsers = this.users.filter(user =>
          user.name.toLowerCase().includes(value.toLowerCase())
        );
      });
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.service.getUsers()
      .pipe(
        catchError(() => {
          this.error = 'Erro ao carregar usuários';
          return of([]);
        })
      )
      .subscribe(data => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      });
  }

  onSearch(event: any) {
    this.search$.next(event.target.value);
  }
}