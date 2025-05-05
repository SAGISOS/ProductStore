import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

export interface OnlineUser {
  userId: string;
  username: string;
  connectedAt: Date;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OnlineUsersService {
  private hubConnection: HubConnection | null = null;
  private onlineUsersSubject = new BehaviorSubject<OnlineUser[]>([]);
  public onlineUsers$ = this.onlineUsersSubject.asObservable();

  constructor(private authService: AuthService) {}

  public startConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      if (!token) {
        reject("Token not found");
        return;
      }

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`http://localhost:5000/hubs/onlineUsers?access_token=${token}`)
        .withAutomaticReconnect()
        .build();

      this.hubConnection
        .start()
        .then(() => {
          console.log('Connected to SignalR');
          this.registerSignalREvents();
          resolve();
        })
        .catch(err => {
          console.error('Connection error:', err);
          reject(err);
        });
    });
  }

  public stopConnection(): void {
    this.hubConnection?.stop()
      .then(() => console.log('Dis SignalR'))
      .catch(err => console.error('error:', err));
  }

  public getOnlineUsers(): void {
    if (this.hubConnection && this.authService.isAdmin()) {
      this.hubConnection.invoke('GetOnlineUsers')
        .catch(err => console.error('Error with online users:', err));
    }
  }

  private registerSignalREvents(): void {
    this.hubConnection?.on('ReceiveOnlineUsers', (users: OnlineUser[]) => {
      this.onlineUsersSubject.next(users);
    });
  }
}