import { Injectable } from '@angular/core';
import { of, delay, throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana@email.com',
      cpf: '111',
      phone: '9999',
      phoneType: 'mobile'
    },
    {
      id: '2',
      name: 'João Souza',
      email: 'joao@email.com',
      cpf: '222',
      phone: '8888',
      phoneType: 'work'
    }
  ];

  getUsers() {
    return of(this.users).pipe(delay(800));
  }

  createUser(user: User) {
    this.users.push(user);
    return of(user).pipe(delay(500));
  }

  updateUser(user: User) {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index === -1) return throwError(() => new Error('User not found'));

    this.users[index] = user;
    return of(user).pipe(delay(500));
  }
}