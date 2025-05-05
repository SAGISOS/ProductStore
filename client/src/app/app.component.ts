import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthService } from './core/services/auth.service';
import { OnlineUsersService } from './core/services/online-users.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client';

  constructor(
    private authService: AuthService,
    private onlineUsersService: OnlineUsersService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.connectToSignalR();
    }
  }

  ngOnDestroy(): void {
    this.onlineUsersService.stopConnection();
  }

  private connectToSignalR(): void {
    this.onlineUsersService.startConnection()
      .then(() => {
        console.log('SignalR ok ');
        if (this.authService.isAdmin()) {
          this.onlineUsersService.getOnlineUsers();
        }
      })
      .catch(err => console.error('Error SignalR:', err));
  }
}
