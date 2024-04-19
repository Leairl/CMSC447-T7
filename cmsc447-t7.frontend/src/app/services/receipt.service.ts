import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receipt } from './interfaces';
import { ReceiptItem } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  private baseUrl = 'http://localhost:4200/api/'; // Update this with proper backend URL

  constructor(private http: HttpClient) { }

  // Get receipt by ID
  getReceiptById(id: number): Observable<Receipt> {
    return this.http.get<Receipt>(`${this.baseUrl}/receipt/${id}`);
  }

  // Create receipt
  createReceipt(id: number, newReceipt: Receipt): Observable<Receipt> {
    return this.http.post<Receipt>(`${this.baseUrl}/receipt/${id}`, newReceipt);
  }


  // Add item to receipt
  addItemToReceipt(receiptId: number, item: ReceiptItem): Observable<Receipt> {
    return this.http.post<Receipt>(`${this.baseUrl}/receipt/${receiptId}/add`, item);
  }

  // Remove item from receipt
  removeItemFromReceipt(receiptId: number, itemId: number): Observable<Receipt> {
    return this.http.delete<Receipt>(`${this.baseUrl}/receipt/${receiptId}/remove}`);
  }

  // Checkout receipt
  checkoutReceipt(receiptId: number): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/receipt/${receiptId}/checkout`, null);
  }
}
