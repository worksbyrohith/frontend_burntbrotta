import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { AuthResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private userRoleSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    this.userRoleSubject.next(this.getRoleFromLocalStorage());
  }

  get userRole$() {
    return this.userRoleSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  getRole(): string | null {
    return this.userRoleSubject.value;
  }

  private getRoleFromLocalStorage(): string | null {
    return localStorage.getItem('user_role');
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      map(response => {
        localStorage.setItem('jwt_token', response.token);
        localStorage.setItem('user_role', response.role);
        this.userRoleSubject.next(response.role);
        return response;
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    this.userRoleSubject.next(null);
  }
}
