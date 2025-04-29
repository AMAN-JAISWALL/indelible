import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
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

  addHotel(data: any): Observable<any> {
    return this._http.post<any>(this.apiUrl + '/hotel/addHotel', data, this.getAuthHeaders());
  }

  getHotels(data: any): Observable<any> {
    return this._http.post<any>(this.apiUrl + '/hotel/getHotels', data, this.getAuthHeaders());
  }

  getActiveHotels(data: any): Observable<any> {
    return this._http.post<any>(this.apiUrl + '/hotel/getactivehotels', data, this.getAuthHeaders());
  }

  updateHotel(data: any): Observable<any> {
    return this._http.put<any>(this.apiUrl + '/hotel/updateHotel', data, this.getAuthHeaders());
  }

  //add hotel Availabilitys http://localhost:3000/hotel/hotelAvailability
  addHotelAvailability(data: any): Observable<any> {
    return this._http.post<any>(this.apiUrl + '/hotel/hotelAvailability', data, this.getAuthHeaders());
  }

  getHotelAvailability(data: any): Observable<any> {
    return this._http.post<any>(this.apiUrl + '/hotel/hotelHistory', data, this.getAuthHeaders());
  }

  getHotelActivityList(data: any): Observable<any> {
    return this._http.post<any>(this.apiUrl + '/hotel/getHotelActivityList', data, this.getAuthHeaders());
  }

  portList(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/port/getlist`, this.getAuthHeaders());
  }

  updateStatus(data: any): Observable<any> {
    return this._http.post<any>(this.apiUrl + '/hotel/updateStatus', data, this.getAuthHeaders());
  }

}
