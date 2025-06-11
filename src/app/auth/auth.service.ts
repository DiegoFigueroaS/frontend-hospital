import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth } from '../firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  backendUrl = 'http://localhost:2426';

  async signup(email: string, password: string, userData: any): Promise<any> {
    const cred: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const res = await fetch(`${this.backendUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userData, firebase_uid: cred.user.uid })
    });
    if (!res.ok) throw new Error('Error creando usuario en backend');
    return res.json();
  }

  async login(email: string, password: string): Promise<any> {
    const cred: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const res = await fetch(`${this.backendUrl}/users`);
    const users = await res.json();
    const user = users.find((u: any) => u.firebase_uid === cred.user.uid);
    if (!user) throw new Error('Usuario no encontrado en backend');
    return user;
  }
}

