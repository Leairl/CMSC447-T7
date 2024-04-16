import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ItemClaim {
  type: string;
  value: string;
}
export interface Response {
  isSuccess: boolean;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private baseUrl:string = "/api/Item"
  constructor(private http : HttpClient) { } /* request to backend from browser*/

public item(itemId:any){ /*any - any type for itemId */
    return this.http.get<any>(`${this.baseUrl}/?itemId=${itemId}`); /* ` - string interpolation (insertion from vars of other strings)*/
  }
}

