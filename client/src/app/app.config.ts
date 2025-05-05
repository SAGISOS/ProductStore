import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([
      (req, next) => 
      {
        const token = localStorage.getItem('token');

        if (!token) 
        {
          return next(req);
        }
        const authReq = req.clone(
        {
          setHeaders: 
          {
            Authorization: `Bearer ${token}`
          }
        });
        return next(authReq);
      }
    ])), 
    provideRouter(routes)
  ]};