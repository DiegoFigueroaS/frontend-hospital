import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MedicalAppointmentsService } from './medical-appointments.service';

@Component({
  selector: 'app-medical-appointment-create',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './medical-appointment-create.html',
  styleUrls: ['./medical-appointment-create.scss']
})
export class MedicalAppointmentCreate implements OnInit {
  @Input() patientId: string = '';
  @Output() appointmentCreated = new EventEmitter<void>();
  hospitals: any[] = [];
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  selectedHospitalId: string = '';
  selectedDoctorId: string = '';
  date: string | Date = '';
  time: string = '';

  readonly APPOINTMENT_STATUS = {
    PENDING: '636091c7-1367-4822-84f0-eb429a9a523a'
  };

  constructor(private service: MedicalAppointmentsService) {}

  async ngOnInit() {
    this.hospitals = await this.service.getHospitals();
    console.log('Hospitals loaded:', this.hospitals);
    
    const allUsers = await this.service.getUsers();
    console.log('All users loaded:', allUsers);
    
    this.doctors = allUsers.filter((u: any) => u.user_type?.type_name?.toLowerCase() === 'doctor');
    console.log('Filtered doctors:', this.doctors);
    
    this.filteredDoctors = [];
  }

  onHospitalChange() {
    console.log('Hospital changed, selected ID:', this.selectedHospitalId);
    
    if (!this.selectedHospitalId) {
      this.filteredDoctors = [];
      return;
    }

    const selectedId = this.selectedHospitalId;
    
    this.filteredDoctors = this.doctors.filter((d: any) => {
      const hasMatchingHospital = d.userHospitals?.some((h: any) => {
        console.log(`Doctor ${d.id} - Hospital check:`, h, 'vs', selectedId);
        return h && h.id === selectedId;
      });
      return hasMatchingHospital;
    });
    
    console.log('Filtered doctors after selection:', this.filteredDoctors);
    this.selectedDoctorId = '';
  }

  getDoctorSpecialty(doctor: any): string {
    return doctor?.specialty?.specialty_name || 'Sin especialidad';
  }

  isFormValid(): boolean {
    return !!(this.selectedHospitalId && this.selectedDoctorId && this.date && this.time);
  }

  async onSubmit() {
    if (!this.selectedHospitalId || !this.selectedDoctorId || !this.date || !this.time) return;
    
    try {
      const appointmentData = {
        hospital_id: this.selectedHospitalId,
        patient_id: this.patientId,
        doctor_id: this.selectedDoctorId,
        appointment_status_id: this.APPOINTMENT_STATUS.PENDING,
        appointment_date: this.date instanceof Date ? this.date.toISOString().split('T')[0] : this.date,
        appointment_time: this.time
      };
      
      console.log('Datos de la cita a enviar:', appointmentData);
      
      await this.service.createAppointment(appointmentData);
      
      this.selectedHospitalId = '';
      this.selectedDoctorId = '';
      this.date = '';
      this.time = '';
      
      alert('Cita creada exitosamente');
      this.appointmentCreated.emit();
    } catch (error) {
      console.error('Error al crear la cita:', error);
      alert('Error al crear la cita. Por favor, inténtalo de nuevo.');
    }
  }
}
