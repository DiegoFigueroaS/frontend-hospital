import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  providers: [AuthService],
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})

export class Signup {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading = false;

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  async onSignup(form: any) {
    console.log('form.value:', form.value);
    console.log('form.invalid:', form.invalid);
    if (form.invalid || this.password !== this.confirmPassword) {
      this.snackBar.open('Verifica los datos y que las contraseñas coincidan', 'Cerrar', { duration: 4000, panelClass: 'snackbar-error', horizontalPosition: 'center', verticalPosition: 'top' });
      return;
    }
    this.loading = true;
    try {
      // Puedes expandir userData con más campos si tu formulario crece
      console.log('Email enviado a Firebase:', this.email);
      console.log('typeof email:', typeof this.email, 'valor:', this.email);
      console.log('typeof password:', typeof this.password, 'valor:', this.password);
      console.log('typeof confirmPassword:', typeof this.confirmPassword, 'valor:', this.confirmPassword);
      await this.authService.signup(this.email, this.password, { full_name: '', phone: '' });
      this.snackBar.open('¡Registro exitoso! Ahora puedes iniciar sesión.', 'Cerrar', { duration: 4000, panelClass: 'snackbar-success', horizontalPosition: 'center', verticalPosition: 'top' });
    } catch (e: any) {
      this.snackBar.open(e.message || 'Error en el registro', 'Cerrar', { duration: 4000, panelClass: 'snackbar-error', horizontalPosition: 'center', verticalPosition: 'top' });
    } finally {
      this.loading = false;
    }
  }
}
