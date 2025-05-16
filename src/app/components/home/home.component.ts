import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterModule} from '@angular/router';
import { AppAuthService } from '../../services/app.auth.service';
import { Observable, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  hasValidRole: boolean = false;
  username: string = '';
  userRoles: string[] = [];

  constructor(
    private authService: AppAuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('HomeComponent initialisiert');

  }
}
