import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
public itemAdd(item:any): Observable<any> {  
  return this.http.post<any>(`${this.baseUrl}`, item);
}
public getAllItems(): Observable<any> {  
  return this.http.get<any>(`${this.baseUrl}/all`); //get request and is identified in the backend.
}


}
