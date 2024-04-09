import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

export interface UserClaim {
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
export class UserService {

  private baseUrl:string = "/api/User/"
  constructor(private http : HttpClient) { } /* request to backend from browser*/

  signup(userObject:any){ /*any - any type for userObject */
    return this.http.post<any>(`${this.baseUrl}register`, userObject) /* ` - string interpolation (insertion from vars of other strings)*/
  }

  login(userObject:any){ /*any - any type for userObject */
  return this.http.post<any>(`${this.baseUrl}authentication`, userObject) /* ` - string interpolation (insertion from vars of other strings)*/
}
public signOut() {
  return this.http.get<any>(`${this.baseUrl}signout`);
}
public user() {
  return this.http.get<UserClaim[]>(`${this.baseUrl}user`);
}
public isSignedIn(): Observable<boolean> {
  return this.user().pipe(
      map((userClaims) => {
          const hasClaims = userClaims.length > 0;
          return !hasClaims ? false : true;
      }),
      catchError((error) => {
        return of(false);
    }));
}
}
