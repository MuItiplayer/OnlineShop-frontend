import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppAuthService } from '../../services/app.auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  returnUrl: string = '/';

  constructor(
    private authService: AppAuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Login-Komponente initialisiert');
    console.log('Ist authentifiziert:', this.authService.isAuthenticated());

    if (this.authService.isAuthenticated()) {
      console.log('Benutzer ist bereits angemeldet');
      this.route.queryParams.subscribe(params => {
        this.returnUrl = params['returnUrl'] || '/';
        console.log('Weiterleitung zu:', this.returnUrl);
        this.router.navigateByUrl(this.returnUrl);
      });
    } else {
      console.log('Benutzer ist nicht angemeldet, Login-Formular anzeigen');
      this.route.queryParams.subscribe(params => {
        this.returnUrl = params['returnUrl'] || '/';
        console.log('Return URL gesetzt auf:', this.returnUrl);
      });
    }
  }

  login(): void {
    console.log('Login Methode aufgerufen');
    this.authService.login();
  }
}
