import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../core/services/product.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ProductCardComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products = data;
        this.filteredProducts = [...this.products];
      },
      error: (err) => {
        console.error('error with products', err);
      }
    });
  }

  removeProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
    this.filteredProducts = this.filteredProducts.filter(p => p.id !== id);
  }

  searchProducts() {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = [...this.products];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(term) || 
      product.description.toLowerCase().includes(term) ||
      product.id.toString().includes(term)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredProducts = [...this.products];
  }
}
