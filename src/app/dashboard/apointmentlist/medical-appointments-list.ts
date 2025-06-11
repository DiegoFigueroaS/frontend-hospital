import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MedicalAppointmentsService } from '../medical-appointments.service';

@Component({
  selector: 'app-medical-appointments-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatListModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './medical-appointments-list.html',
  styleUrls: ['./medical-appointments-list.scss']
})
export class MedicalAppointmentsList implements OnInit {
  @Input() userId!: string;
  @Output() appointmentsUpdated = new EventEmitter<void>();
  appointments: any[] = [];

  constructor(
    private apptService: MedicalAppointmentsService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadAppointments();
  }

  async loadAppointments() {
    try {
      const all = await this.apptService.getAppointments();
      this.appointments = all.filter((a: any) => a.patient_id === this.userId);
      this.appointmentsUpdated.emit();
      return Promise.resolve();
    } catch (error) {
      console.error('Error cargando citas:', error);
      return Promise.reject(error);
    }
  }

  canCancel(appointment: any): boolean {
    const status = appointment.status?.status_name?.toLowerCase();
    return ['pending', 'confirmed'].includes(status);
  }

  getStatusClass(statusName?: string): string {
    if (!statusName) return 'pending';
    
    const statusMap: {[key: string]: string} = {
      'Pendiente': 'pending',
      'Confirmada': 'confirmed',
      'Cancelada': 'cancelled',
      'Completada': 'completed'
    };
    
    return statusMap[statusName] || 'pending';
  }

  async cancelAppointment(appointmentId: string) {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.')) {
      try {
        await this.apptService.deleteAppointment(appointmentId);
        alert('La cita ha sido cancelada correctamente.');
        await this.loadAppointments();
        this.appointmentsUpdated.emit();
      } catch (error) {
        console.error('Error al cancelar la cita:', error);
        alert('No se pudo cancelar la cita. Por favor, inténtalo de nuevo.');
      }
    }
  }

  navigateToAppointment() {
    this.router.navigate(['/appointment']);
  }
}
