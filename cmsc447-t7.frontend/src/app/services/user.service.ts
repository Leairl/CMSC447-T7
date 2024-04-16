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

  public hasSignedIn: boolean = false;
  private baseUrl:string = "/api/User/"
  public email:string = ""
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
public isSignedIn(): Observable<boolean> {  //backend validation
  return this.user().pipe(    //requests from the backend to validate the cookie for the user account (ASP.net handles cookie auth.)
      map((userClaims) => { //reference to all components when authenticating user account while signing in
          const hasClaims = userClaims.length > 0;  //gets claims out of cookie that displays email
          if (hasClaims) {
            this.hasSignedIn = true;    //if the user has made the attempt to sign in and is successful
            this.email = userClaims[0].value //display first element in cookie claims (email property) when validated
          }
          return !hasClaims ? false : true;   //if there are claims from cookie return true else false
      }),
      catchError((error) => {
        return of(false);
    }));
}
}
