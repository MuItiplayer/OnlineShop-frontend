import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Product } from '../models/product.model';



@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Product[]>('http://localhost:8080/read');
  }

  getById(id: number) {
    return this.http.get<Product>('http://localhost:8080/product/' + id);
  }

  create(product: Product) {
    return this.http.post<Product>('http://localhost:9090/product/create', product);
  }

  delete(id: number) {
    return this.http.delete('http://localhost:8080/product/delete' + id);
  }
}
