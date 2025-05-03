import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() name!: string;
  @Input() description!: string;
  @Input() price!: number;
  @Input() stock!: number;
  @Input() id!: number;
  @Output() deleted = new EventEmitter<number>();

  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.authService.isAdmin$.subscribe(status => {
      this.isAdmin = status;
    });

    console.log('stock:', this.stock);
  }

  onSubmit() {
    if (!confirm('האם למחוק מוצר זה?')) return;

    this.productService.deleteProduct(this.id).subscribe({
      next: () => {
        alert('המוצר נמחק בהצלחה');
        this.deleted.emit(this.id);
      },
      error: err => {
        console.error('שגיאה במחיקה', err);
        alert('נכשל במחיקה');
      }
    });
  }
}
