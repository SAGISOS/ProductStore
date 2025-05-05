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

  refreshUsers(): void 
  {
    this.onlineUsersService.getOnlineUsers();
  }

  formatDateTime(date: Date): string 
  {
    if (!date) 
      return '';
    else
    {
      const d = new Date(date);
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      return `${d.toLocaleDateString('en-GB')} ${hours}:${minutes}`;
    }
  }
}