import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/product/read`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/product/read/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/product/create`, product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/product/update/${id}`, product);
  }

  delete(id: number): Observable<void> {
    const url = `${this.baseUrl}/product/delete/${id}`;
    console.log(`Sende DELETE-Anfrage an: ${url}`);

    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Produkt mit ID ${id} erfolgreich gelöscht`))
    );
  }

  testDeleteWithPost(id: number): Observable<void> {
    const url = `${this.baseUrl}/product/delete/${id}`;
    console.log(`Sende POST-Anfrage für Löschung an: ${url}`);

    return this.http.post<void>(url, {}).pipe(
      tap(() => console.log(`Produkt mit ID ${id} erfolgreich gelöscht via POST`))
    );
  }
}
