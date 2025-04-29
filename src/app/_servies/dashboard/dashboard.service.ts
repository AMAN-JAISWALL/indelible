import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  private apiUrl = environment.apiUrl

  constructor(
    private http: HttpClient
  ) { }

  private getAuthHeaders () {
    const token = localStorage.getItem('jwtToken');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }
  }

  getDashboardData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/dashboard/booking-matrics`, data, this.getAuthHeaders());
  }

  getOperationalData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/dashboard/operational-insights`, data, this.getAuthHeaders());
  }

  revenueBreakdown(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/dashboard/revenuegraph`, data, this.getAuthHeaders());
  }

  revenueTrends(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/dashboard/revenue-trends`, data, this.getAuthHeaders());
  }

  profitMargin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/dashboard/profitmargin`, data, this.getAuthHeaders());
  }

}
