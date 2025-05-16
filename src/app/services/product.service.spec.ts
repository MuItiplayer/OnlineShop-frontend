import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:9090';

  const mockProduct: Product = {
    id: 1,
    name: 'Test Produkt',
    description: 'Dies ist ein Testprodukt',
    price: 19.99,
  };

  const mockProducts: Product[] = [
    mockProduct,
    {
      id: 2,
      name: 'Zweites Produkt',
      description: 'Ein weiteres Testprodukt',
      price: 29.99,
    }
  ];

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
    service.getAll().subscribe(products => {
      expect(products).toEqual(mockProducts);
      expect(products.length).toBe(2);
    });

    const req = httpMock.expectOne(`${baseUrl}/product/read`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts); // Simuliere Serverantwort
  });

  it('sollte ein Produkt anhand der ID abrufen', () => {
    const id = 1;

    service.getById(id).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/product/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('sollte ein neues Produkt erstellen', () => {
    const newProduct: Product = { ...mockProduct, id: undefined };

    service.create(newProduct).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/product/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(mockProduct);
  });

  it('sollte ein vorhandenes Produkt aktualisieren', () => {
    const id = 1;
    const updatedProduct: Product = { ...mockProduct, name: 'Aktualisiertes Produkt' };

    service.update(id, updatedProduct).subscribe(product => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/product/update/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush(updatedProduct);
  });

  it('sollte ein Produkt löschen', () => {
    const id = 1;

    service.delete(id).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/product/delete/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
