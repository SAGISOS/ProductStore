import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductCardComponent {
  @Input() name!: string;
  @Input() description!: string;
  @Input() price!: number;
  @Input() stock!: number;
  @Input() id!: number;
  @Input() imageUrl!: string;
  @Output() deleted = new EventEmitter<number>();

  isAdmin = false;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.isAdmin$.subscribe(status => {
      this.isAdmin = status;
    });
  }

  onDelete(event: Event) {
    event.stopPropagation();

    if (!confirm('Delete this product?')) return;

    this.productService.deleteProduct(this.id).subscribe({
      next: () => {
        alert('Product deleted successfully');
        this.deleted.emit(this.id);
      },
      error: () => {
        alert('Failed to delete product');
      }
    });
  }

  openDetails(event: Event) {
    this.router.navigate(['/products', this.id]);
  }
}