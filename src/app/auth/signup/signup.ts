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
  full_name: string = '';
  phone: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading = false;

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  async onSignup(): Promise<void> {
    if (!this.full_name || !this.phone || !this.email || !this.password || this.password !== this.confirmPassword) {
      this.snackBar.open('Verifica los datos y que las contraseñas coincidan', 'Cerrar', {
        duration: 4000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    let user_type_id = '';
    try {
      const res = await fetch('http://localhost:2426/user-types');
      const types = await res.json();
      const patientType = types.find((t: any) => t.type_name.toLowerCase() === 'patient');
      if (!patientType) throw new Error('No se encontró tipo Patient');
      user_type_id = patientType.id;
    } catch (e) {
      this.snackBar.open('Error obteniendo tipo de usuario Patient', 'Cerrar', {
        duration: 4000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    this.loading = true;
    try {
      console.log('Email enviado a Firebase:', this.email);
    console.log('typeof email:', typeof this.email, 'valor:', this.email);
    console.log('typeof password:', typeof this.password, 'valor:', this.password);
    console.log('typeof confirmPassword:', typeof this.confirmPassword, 'valor:', this.confirmPassword);
      await this.authService.signup(this.email, this.password, {
        full_name: this.full_name,
        phone: this.phone,
        user_type_id,
        userHospitals: [],
        userClinics: []
      });
      this.snackBar.open('¡Registro exitoso! Ahora puedes iniciar sesión.', 'Cerrar', { duration: 4000, panelClass: 'snackbar-success', horizontalPosition: 'center', verticalPosition: 'top' });
    } catch (e: any) {
      this.snackBar.open(e.message || 'Error en el registro', 'Cerrar', { duration: 4000, panelClass: 'snackbar-error', horizontalPosition: 'center', verticalPosition: 'top' });
    } finally {
      this.loading = false;
    }
  }
}
