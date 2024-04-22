import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receipt } from './interfaces';
import { ReceiptItem } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  private baseUrl = '/api/Receipt/'; // Update this with proper backend URL

  constructor(private http: HttpClient) { }

  // Get receipt by ID
  getReceiptById(receiptId: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/?receiptID=${receiptId}`);
  }

  // Create receipt
  createReceipt(receiptId: any, newReceipt: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/?receiptID=${receiptId}`, newReceipt);
  }


  // Add item to receipt
  addItemToReceipt(receiptId: any, item: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add/?receiptID=${receiptId}`, item);
  }

  // Remove item from receipt
  removeItemFromReceipt(receiptId: number, itemId: number): Observable<Receipt> {
    return this.http.delete<Receipt>(`${this.baseUrl}/remove/${receiptId}/${itemId}`);
  }

  // Checkout receipt
  checkoutReceipt(receiptId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/stripe/${receiptId}`, null);
  }
}
