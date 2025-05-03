import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  // הוספת מוצר - רק למנהל
  addProduct(product: {
    name: string;
    description: string;
    price: number;
    stock: number;
  }) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}`, product, { headers });
  }

  // קבלת כל המוצרים
  getAllProducts() {
    return this.http.get(`${this.apiUrl}`);
  }

  // קבלת מוצר לפי מזהה
  getProductById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // מחיקת מוצר
  deleteProduct(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  // עדכון מוצר
  updateProduct(id: number, product: {
    name: string;
    description: string;
    price: number;
    stock: number;
  }) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/${id}`, product, { headers });
  }
}
