import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: ''
  };

  constructor(private productService: ProductService) {}

  onSubmit() {
    this.productService.addProduct(this.product).subscribe({
      next: () => {
        alert('Product added successfully');
        this.product = { id: 0, name: '', description: '', price: 0, stock: 0, imageUrl: '' };
      },
      error: err => {
        console.error('Failed to add product', err);
        alert('Failed to add product');
      }
    });
  }
}
