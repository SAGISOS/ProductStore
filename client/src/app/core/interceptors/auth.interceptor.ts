import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // קבלת הטוקן מהאחסון המקומי
    const token = localStorage.getItem('token');
    
    // אם אין טוקן, מעביר את הבקשה כמו שהיא
    if (!token) {
      return next.handle(request);
    }
    
    // יצירת בקשה חדשה עם הטוקן
    const authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // העברת הבקשה המעודכנת
    return next.handle(authReq);
  }
} 