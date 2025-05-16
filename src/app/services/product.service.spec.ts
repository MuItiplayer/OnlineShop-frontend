import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:9090';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte alle Produkte abrufen', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Produkt 1', description: 'Beschreibung 1', price: 99.99 },
      { id: 2, name: 'Produkt 2', description: 'Beschreibung 2', price: 149.99 }
    ];

    service.getAll().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${baseUrl}/product/read`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('sollte ein Produkt nach ID abrufen', () => {
    const mockProduct: Product = { id: 1, name: 'Produkt 1', description: 'Beschreibung 1', price: 99.99 };
    const productId = 1;

    service.getById(productId).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/product/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('sollte ein neues Produkt erstellen', () => {
    const mockProduct: Product = { name: 'Neues Produkt', description: 'Neue Beschreibung', price: 199.99 };
    const createdProduct: Product = { id: 3, ...mockProduct };

    service.create(mockProduct).subscribe(product => {
      expect(product).toEqual(createdProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/product/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(createdProduct);
  });

  it('sollte ein Produkt aktualisieren', () => {
    const productId = 1;
    const mockProduct: Product = { id: productId, name: 'Aktualisiertes Produkt', description: 'Aktualisierte Beschreibung', price: 249.99 };

    service.update(productId, mockProduct).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/product/update/${productId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('sollte ein Produkt löschen', () => {
    const productId = 1;

    service.delete(productId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/product/delete/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
