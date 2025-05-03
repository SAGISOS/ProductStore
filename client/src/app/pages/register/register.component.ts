import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent
{
  userName = '';
  password = '';
  Email = '';
  Phone = '';
  IsAdmin = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.register(this.userName, this.password, this.Email, this.Phone, this.IsAdmin).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
        window.location.href = '/';
      },
      error: (err: any) => {
        alert('משתמש קיים או בעייה בהרשמה');
        console.error(err);
      }
    });
  }
}



