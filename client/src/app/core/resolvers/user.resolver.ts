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
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return of(null);
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return of(null);
    }

    return this.userService.getUserById(userId).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return of(null);
      })
    );
  }
}