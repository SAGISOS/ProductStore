import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { OnlineUsersService, OnlineUser } from '../../core/services/online-users.service';

@Component({
  selector: 'app-online-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent implements OnInit, OnDestroy {
  onlineUsers: OnlineUser[] = [];
  private subscription: Subscription | null = null;

  constructor(private onlineUsersService: OnlineUsersService) {}

  ngOnInit(): void {
    this.subscription = this.onlineUsersService.onlineUsers$.subscribe(users => {
      this.onlineUsers = users;
    });

    this.refreshUsers();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  refreshUsers(): void {
    this.onlineUsersService.getOnlineUsers();
  }

  formatDateTime(date: Date): string {
    if (!date) 
      return '';
    
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${d.toLocaleDateString('en-GB')} ${hours}:${minutes}`;
  }
  
  getSessionDuration(connectedAt: Date): string {
    if (!connectedAt) return '';
    
    const now = new Date();
    const connected = new Date(connectedAt);
    const diffMs = now.getTime() - connected.getTime();
    
    // Convert to seconds, minutes, hours
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
  
  getAdminCount(): number {
    return this.onlineUsers.filter(user => user.isAdmin).length;
  }
}