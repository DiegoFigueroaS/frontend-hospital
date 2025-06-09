import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private auth: Auth, private http: HttpClient) {}

  async register(email: string, password: string, fullName: string): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const firebase_uid = cred.user.uid;

    await this.http.post(`${this.apiUrl}/users`, {
      firebase_uid,
      full_name: fullName,
      phone: '00000000', // puedes agregarlo dinámico
      user_type_id: 'ID-DEL-ROL-PACIENTE',
      userHospitals: [],
      userClinics: []
    }).toPromise();

    return cred;
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
}
