import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService, User } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User | null> {
  
  constructor(
    private userService: UserService, 
    private authService: AuthService,
    private router: Router
  ) {}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User | null> {
    // בדיקה אם המשתמש מחובר
    if (!this.authService.isAuthenticated()) {
      console.log('משתמש לא מחובר, מעביר לדף ההתחברות');
      this.router.navigate(['/login']);
      return of(null);
    }
    
    const userId = this.authService.getUserId();
    if (!userId) {
      console.log('לא נמצא מזהה משתמש, מעביר לדף ההתחברות');
      this.router.navigate(['/login']);
      return of(null);
    }
    
    // כעת HTTP Interceptor יוסיף את הטוקן באופן אוטומטי
    console.log('שולח בקשה לקבלת פרטי משתמש עם מזהה:', userId);
    
    return this.userService.getUserById(userId).pipe(
      catchError(error => {
        console.error('שגיאה בטעינת פרטי משתמש:', error);
        if (error.status === 401) {
          console.log('הטוקן פג תוקף, מעביר לדף ההתחברות');
          this.router.navigate(['/login']);
        }
        return of(null);
      })
    );
  }
} 