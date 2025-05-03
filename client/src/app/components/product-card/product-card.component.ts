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

  isAdmin: boolean = false;

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

  onSubmit(event: Event) {
    event.stopPropagation(); // מונע את מעבר העמוד במקרה של לחיצה על delete

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

  goToDetails(event: Event) {
    this.router.navigate(['/products', this.id]);
  }
}
