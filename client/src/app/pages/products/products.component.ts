import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../core/services/product.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products = data;
      },
      error: (err) => {
        console.error('error with products', err);
      }
    });
  }

  removeProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }
}
