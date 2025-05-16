import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  productForm!: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  createProduct(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const product: Product = {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price
    };

    this.productService.create(product).subscribe({
      next: () => {
        console.log('Produkt erfolgreich erstellt');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Fehler beim Erstellen des Produkts:', error);
        this.isSubmitting = false;
        this.errorMessage = 'Fehler beim Erstellen des Produkts: ' +
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

  cancelCreate(): void {
    this.router.navigate(['/products']);
  }
}
