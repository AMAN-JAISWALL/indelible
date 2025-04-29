import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
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

  reservationCreate(data: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/reservation/createnew`, data, this.getAuthHeaders());
  }

  portList(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/port/getlist`, this.getAuthHeaders());
  }

  airlineList(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/airline/getlist`, this.getAuthHeaders());
  }

  reservationList(data: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/reservation/getlist`, data, this.getAuthHeaders());
  }

  reservationUpdateStatus(data: any): Observable<any> {
    return this._http.put<any>(`${this.apiUrl}/reservation/updateStatus`, data, this.getAuthHeaders());
  }

  reservationCopy(data: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/reservation/copy`, data, this.getAuthHeaders());
  }

  //  // reservation/updateNotes
  // put
  reservationUpdateNotes(data: any): Observable<any> {
    return this._http.put<any>(`${this.apiUrl}/reservation/updateNotes`, data, this.getAuthHeaders());
  }

  // reservation/getreservationbyid
  getReservationById(data: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/reservation/getreservationbyid`, data, this.getAuthHeaders());
  }

  // reservation/update-put
  reservationEdit(data: any): Observable<any> {
    return this._http.put<any>(`${this.apiUrl}/reservation/update`, data, this.getAuthHeaders());
  }

  // reservation/downloadpdf
  // post
  // { reservationid }

  downloadpdf(data: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/reservation/downloadpdf`, data, this.getAuthHeaders());
  }

  //   http://localhost:3000/reservation/sendpdf
  // POST

  sendpdf(data: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/reservation/sendpdf`, data, this.getAuthHeaders());
  }

  reservationFileUpload(data: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/reservation/fileupload`, data, this.getAuthHeaders());
  }

}
