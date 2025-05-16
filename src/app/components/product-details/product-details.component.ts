
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productForm!: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  loading: boolean = true;
  productId!: number;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProduct();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  loadProduct(): void {
    this.loading = true;
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.errorMessage = 'Ungültige Produkt-ID';
      this.router.navigate(['/products']);
      return;
    }

    this.productId = +idParam;

    this.productService.getById(this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Fehler beim Laden des Produkts:', error);
        this.errorMessage = 'Fehler beim Laden des Produkts: ' +
          (error.error?.message || error.message || 'Unbekannter Fehler');
        this.loading = false;
      }
    });
  }

  updateProduct(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const updatedProduct: Product = {
      id: this.productId,
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price
    };

    this.productService.update(this.productId, updatedProduct).subscribe({
      next: () => {
        console.log('Produkt erfolgreich aktualisiert');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Fehler beim Aktualisieren des Produkts:', error);
        this.isSubmitting = false;
        this.errorMessage = 'Fehler beim Aktualisieren des Produkts: ' +
          (error.error?.message || error.message || 'Unbekannter Fehler');
      }
    });
  }

  hasError(controlName: string, errorName?: string): boolean {
    const control = this.productForm.get(controlName);
    if (errorName) {
      return control !== null && control.touched && control.hasError(errorName);
    }
    return control !== null && control.touched && control.invalid;
  }

  cancelEdit(): void {
    this.router.navigate(['/products']);
  }
}
