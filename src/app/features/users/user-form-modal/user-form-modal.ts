import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form-modal.html'
})
export class UserFormModal {

  private fb = inject(FormBuilder);
  private service = inject(UserService);
  private dialogRef = inject(MatDialogRef);

  form = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', Validators.required],
    phone: ['', Validators.required],
    phoneType: ['mobile']
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: User) {
    if (data) this.form.patchValue(data);
  }

  save() {
    if (this.form.invalid) return;

    const user = this.form.value as User;

    const request = user.id
      ? this.service.updateUser(user)
      : this.service.createUser({ ...user, id: crypto.randomUUID() });

    request.subscribe(() => this.dialogRef.close(true));
  }
}