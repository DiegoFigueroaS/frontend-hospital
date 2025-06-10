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

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  async onLogin(form: any) {
    if (form.invalid) {
      this.snackBar.open('Verifica los datos', 'Cerrar', { duration: 4000, panelClass: 'snackbar-error', horizontalPosition: 'center', verticalPosition: 'top' });
      return;
    }
    this.loading = true;
    try {
      const user = await this.authService.login(this.email, this.password);
      this.snackBar.open('¡Bienvenido, ' + (user.full_name || 'usuario') + '!', 'Cerrar', { duration: 4000, panelClass: 'snackbar-success', horizontalPosition: 'center', verticalPosition: 'top' });
      // Aquí puedes guardar el usuario en localStorage o navegar a otra ruta
    } catch (e: any) {
      this.snackBar.open(e.message || 'Error en el login', 'Cerrar', { duration: 4000, panelClass: 'snackbar-error', horizontalPosition: 'center', verticalPosition: 'top' });
    } finally {
      this.loading = false;
    }
  }
}
