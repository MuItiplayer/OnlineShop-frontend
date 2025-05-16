
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { AppAuthService } from '../../services/app.auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  isAdmin: boolean = false;

  constructor(
    private productService: ProductService,
    private authService: AppAuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.checkAdminRole();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Fehler beim Laden der Produkte:', error);
        this.loading = false;
      }
    });
  }

  checkAdminRole(): void {
    this.authService.getRoles().subscribe(roles => {
      this.isAdmin = roles.includes('admin');
    });
  }
}
