import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MedicalAppointmentsService {
  private api = 'http://localhost:2426';

  async getAppointments(): Promise<any[]> {
    const res = await fetch(`${this.api}/medical-appointments`);
    return await res.json();
  }

  async getHospitals(): Promise<any[]> {
    const res = await fetch(`${this.api}/hospitals`);
    return await res.json();
  }

  async getUsers(): Promise<any[]> {
    const res = await fetch(`${this.api}/users`);
    return await res.json();
  }

  async createAppointment(data: any): Promise<any> {
    try {
      console.log('Enviando datos al servidor:', data);
      const res = await fetch(`${this.api}/medical-appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error creando cita');
      }
      
      return await res.json();
    } catch (error) {
      console.error('Error en createAppointment:', error);
      throw error;
    }
  }

  async deleteAppointment(appointmentId: string): Promise<void> {
    try {
      const res = await fetch(`${this.api}/medical-appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Error del servidor al eliminar cita:', errorData);
        throw new Error(errorData.message || 'Error eliminando la cita');
      }
      
      return await res.json();
    } catch (error) {
      console.error('Error en deleteAppointment:', error);
      throw error;
    }
  }

  async getAppointmentStatuses(): Promise<any[]> {
    const res = await fetch(`${this.api}/appointment-statuses`);
    return await res.json();
  }
  
}
