import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([
      (req, next) => {
        // קבלת הטוקן מהאחסון המקומי
        const token = localStorage.getItem('token');
        
        // אם אין טוקן, מעביר את הבקשה כמו שהיא
        if (!token) {
          return next(req);
        }
        
        // יצירת בקשה חדשה עם הטוקן
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // העברת הבקשה המעודכנת
        return next(authReq);
      }
    ])), 
    provideRouter(routes)
  ]
};
