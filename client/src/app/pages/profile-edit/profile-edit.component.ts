import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService, User } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  user: User = {
    id: 0,
    userName: '',
    email: '',
    phone: '',
    isAdmin: false
  };

  constructor(
    private userService: UserService, 
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    const resolvedUser = this.route.snapshot.data['user'];
    
    if (resolvedUser) {
      this.user = resolvedUser;
    } else {

      const userId = this.authService.getUserId();
      if (!userId) {
        console.error('No user ID found');
        return;
      }

      this.userService.getUserById(userId).subscribe({
        next: (data) => this.user = data,
        error: (err) => console.error('Failed to fetch user:', err)
      });
    }
  }

  successMessage: string = '';

  saveProfile(): void {
    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => this.successMessage = '', 3000); // 3 SEC 
      },
      error: (err) => {
        console.error('Failed to update user:', err);
      }
    });
  }

  cancel(): void {
    console.log('Edit cancelled');
  }
}
