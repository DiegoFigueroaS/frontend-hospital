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
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})

export class Login {
  email: string = '';
  password: string = '';
  loading = false;

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.snackBar.open('Verifica los datos', 'Cerrar', { duration: 4000, panelClass: 'snackbar-error', horizontalPosition: 'center', verticalPosition: 'top' });
      return;
    }
    this.loading = true;
    try {
      console.log('Email enviado a Firebase:', this.email);
    console.log('typeof email:', typeof this.email, 'valor:', this.email);
    console.log('typeof password:', typeof this.password, 'valor:', this.password);
    const user = await this.authService.login(this.email, this.password);
      this.snackBar.open('¡Bienvenido, ' + (user.full_name || 'usuario') + '!', 'Cerrar', { duration: 4000, panelClass: 'snackbar-success', horizontalPosition: 'center', verticalPosition: 'top' });
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.snackBar.open(e.message || 'Error en el login', 'Cerrar', { duration: 4000, panelClass: 'snackbar-error', horizontalPosition: 'center', verticalPosition: 'top' });
    } finally {
      this.loading = false;
    }
  }
}
