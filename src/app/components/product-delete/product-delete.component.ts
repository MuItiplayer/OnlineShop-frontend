import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-delete.component.html',
  styleUrls: ['./product-delete.component.css']
})
export class ProductDeleteComponent implements OnInit {
  @Input() productId!: number;
  @Input() productName: string = '';
  @Output() deleteStarted = new EventEmitter<void>();
  @Output() deleteCompleted = new EventEmitter<void>();
  @Output() deleteError = new EventEmitter<string>();

  isDeleting: boolean = false;
  showConfirmation: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('ProductDeleteComponent initialisiert mit ID:', this.productId);
  }

  confirmDelete(e : Event): void {
    e.preventDefault();
    console.log('Löschbestätigung geöffnet für Produkt ID:', this.productId);
    this.showConfirmation = true;
  }

  cancelDelete(): void {
    this.showConfirmation = false;
  }

  deleteProduct(): void {
    if (!this.productId) {
      console.error('Produkt-ID ist nicht definiert');
      this.deleteError.emit('Produkt-ID ist nicht definiert');
      return;
    }

    console.log('Starte Löschvorgang für Produkt mit ID:', this.productId);
    this.isDeleting = true;
    this.deleteStarted.emit();

    this.productService.delete(this.productId).subscribe({
      next: () => {
        console.log(`Produkt ${this.productId} erfolgreich gelöscht`);
        this.isDeleting = false;
        this.deleteCompleted.emit();
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 100);
      },
      error: (error) => {
        console.error('Fehler beim Löschen des Produkts:', error);
        this.isDeleting = false;
        this.showConfirmation = false;

        let errorMessage = 'Fehler beim Löschen des Produkts: ';

        if (error.status === 403) {
          errorMessage += 'Keine Berechtigung zum Löschen des Produkts. Bitte melden dich als Administrator an.';
        } else {
          errorMessage += (error.error?.message || error.message || 'Unbekannter Fehler');
        }

        this.deleteError.emit(errorMessage);
      }
    });
  }
}
