import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppAuthService } from '../../services/app.auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private authService: AppAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.usernameObservable.subscribe(username => {
      this.username = username;
      this.isLoggedIn = this.authService.isAuthenticated();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
