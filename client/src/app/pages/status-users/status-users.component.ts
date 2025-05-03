import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService, User } from '../../core/services/user.service';

@Component({
  selector: 'app-status-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './status-users.component.html',
  styleUrls: ['./status-users.component.css']
})
export class StatusUsersComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(
    private userService: UserService,
    private router: Router // ✅ זה מה שהיה חסר
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  openEdit(user: User): void {
    this.selectedUser = { ...user };
  }

  cancelEdit(): void {
    this.selectedUser = null;
  }

  confirmEdit(): void {
    if (!this.selectedUser) return;

    this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
      next: () => {
        console.log('User updated successfully');
        const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
        if (index !== -1) {
          this.users[index] = { ...this.selectedUser! };
        }
        this.selectedUser = null;
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }

  deleteUser(): void {
    if (!this.selectedUser) return;

    this.userService.deleteUser(this.selectedUser.id).subscribe({
      next: () => {
        console.log('User deleted successfully');
        this.users = this.users.filter(u => u.id !== this.selectedUser!.id);
        this.selectedUser = null;
        this.router.navigate(['/status-users']); // ✅ עובד עכשיו כמו שצריך
      },
      error: (err: any) => {
        console.error('Delete failed', err);
      }
    });
  }
}
