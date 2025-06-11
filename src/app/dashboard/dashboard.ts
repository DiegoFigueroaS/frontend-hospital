import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MedicalAppointmentsList } from './apointmentlist/medical-appointments-list';
import { MedicalAppointmentCreate } from './apointmentcreate/medical-appointment-create';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTooltipModule,
    MedicalAppointmentsList, 
    MedicalAppointmentCreate
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {
  @ViewChild('appointmentsList') appointmentsList!: MedicalAppointmentsList;
  user: any = null;
  showUserInfoDialog = false;
  showCreateAppt = false;
  hasAppointments = false;

  constructor(private router: Router) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('user');
      this.user = storedUser ? JSON.parse(storedUser) : null;
      if (!this.user) {
        this.router.navigate(['/login']);
      }
    }
  }

  showUserInfo() {
    this.showUserInfoDialog = true;
  }

  closeUserInfo() {
    this.showUserInfoDialog = false;
  }

  onAppointmentCreated() {
    this.appointmentsList.loadAppointments().then(() => {
      this.checkAppointments();
    });
  }

  ngAfterViewInit() {
    this.checkAppointments();
    if (this.appointmentsList) {
      this.appointmentsList.appointmentsUpdated.subscribe(() => {
        this.checkAppointments();
      });
    }
  }

  checkAppointments() {
    this.hasAppointments = this.appointmentsList?.appointments?.length > 0;
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }
  }
}
