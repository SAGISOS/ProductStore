import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';

  private userNameSubject = new BehaviorSubject<string | null>(this.getUserName());
  userName$ = this.userNameSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(this.extractIsAdmin());
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private extractIsAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload["IsAdmin"] === 'true' || payload["IsAdmin"] === true;
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  login(userName: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { userName, password });
  }

  register(userName: string, password: string, email: string, phone: string, isAdmin: boolean) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, {
      userName, password, email, phone, isAdmin
    });
  }



  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.userNameSubject.next(this.getUserName());
    this.isAdminSubject.next(this.extractIsAdmin());
  }

  logout() {
    localStorage.removeItem('token');
    this.userNameSubject.next(null);
    this.isAdminSubject.next(false);
    this.router.navigate(['/login']).then(() => window.location.reload());
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserName(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
        || payload["name"]
        || payload["unique_name"]
        || null;
    } catch {
      return null;
    }
  }


  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      return id ? Number(id) : null;
    } catch {
      return null;
    }
  }


}
