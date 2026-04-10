import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user';
import { User } from '../../../core/models/user';
import { Subject, debounceTime, catchError, of } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserFormModal } from '../user-form-modal/user-form-modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss']
})
export class UserList implements OnInit {

  private service = inject(UserService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  users = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);

  loading = signal(false);
  error = signal<string | null>(null);

  private search$ = new Subject<string>();

  ngOnInit() {
    this.loadUsers();

    this.search$
      .pipe(
        debounceTime(300),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        this.filteredUsers.set(
          this.users().filter(user =>
            user.name.toLowerCase().includes(value.toLowerCase())
          )
        );
      });
  }

  loadUsers() {
    this.loading.set(true);
    this.error.set(null);

    this.service.getUsers()
      .pipe(
        catchError(() => {
          this.error.set('Erro ao carregar usuários');
          return of([]);
        })
      )
      .subscribe(data => {
        this.users.set(data);
        this.filteredUsers.set(data);
        this.loading.set(false);
      });
  }

  onSearch(event: any) {
    this.search$.next(event.target.value);
  }

  openModal(user?: User) {
    const dialogRef = this.dialog.open(UserFormModal, {
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }
}