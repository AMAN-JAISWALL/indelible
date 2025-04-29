import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsermanagementService {
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

  createUsers(data: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/user/users`, data, this.getAuthHeaders());
  }

  getUsers(data: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/user/getusers`, data, this.getAuthHeaders());
  }

  updateUserStatus(data: any): Observable<any> {
    return this._http.put<any>(`${this.apiUrl}/user/updateUserStatus`, data, this.getAuthHeaders());
  }

  updateUser(data: any): Observable<any> {
    return this._http.put<any>(`${this.apiUrl}/user/updateUser`, data, this.getAuthHeaders());
  }

  getUserById(id: any): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/user/users/${id}`, this.getAuthHeaders());
  }

  Updatepassword(data: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/user/updatepassword`, data, this.getAuthHeaders());
  }

  updateProfilePicture(data: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/user/imageupload`, data, this.getAuthHeaders());
  }

  getRole(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/user/getroles`, this.getAuthHeaders());
  }

}
