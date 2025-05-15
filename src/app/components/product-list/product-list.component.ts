import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [
    NgForOf
  ],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe(data => {
      this.products = data;
    });
  }
}
