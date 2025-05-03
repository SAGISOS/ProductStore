import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  addProduct(product: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
  }) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const isValidImageUrl = (url: string) =>
      !!url && /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);

    const finalProduct = {
      ...product,
      imageUrl: isValidImageUrl(product.imageUrl)
        ? product.imageUrl
        : 'https://islandpress.org/files/default_book_cover_2015.jpg'
    };

    return this.http.post(`${this.apiUrl}`, finalProduct, { headers });
  }

  getAllProducts() {
    return this.http.get(`${this.apiUrl}`);
  }

  getProductById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  deleteProduct(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  updateProduct(id: number, product: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
  }) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/${id}`, product, { headers });
  }
}
