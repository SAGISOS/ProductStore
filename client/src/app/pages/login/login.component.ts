import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName = '';
  password = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.userName, this.password).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
        window.location.href = '/';
      },
      error: (err: any) => {
        alert('פרטי התחברות שגויים');
        console.error(err);
      }
    });
  }
}
