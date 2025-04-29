import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  constructor(private _http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('jwtToken');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }
  }

  logIn(data: any): Observable<any> {
    return this._http.post<any>(this.apiUrl + '/account/login', data, this.getAuthHeaders());
  }

  verify(data: any): Observable<any> {
    return this._http.post<any>(this.apiUrl + '/user/verify', data, this.getAuthHeaders());
  }

  resendcode(data: any): Observable<any> {
    return this._http.post<any>(this.apiUrl + '/account/resendcode', data, this.getAuthHeaders());
  }


}
