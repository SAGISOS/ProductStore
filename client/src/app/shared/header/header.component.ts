import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent implements OnInit {
  userName: string | null = null;
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit()
  {
    this.authService.userName$.subscribe(name => {
      this.userName = name;
    });

    this.authService.isAdmin$.subscribe(status => {
      this.isAdmin = status;
    });
  }

  logout()
  {
    this.authService.logout();
  }
}
