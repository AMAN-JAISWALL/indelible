import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private static isErrorHandled = false;

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwtToken');

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if ((error.status === 401 || error.status === 403) && !AuthInterceptor.isErrorHandled) {
          AuthInterceptor.isErrorHandled = true;
          localStorage.removeItem('jwtToken');
          this.toastr.error("Token expired. Please log in again.");
          this.router.navigate(['/auth/signin']);
          setTimeout(() => {
            AuthInterceptor.isErrorHandled = false
          }, 3000);
        }
        return throwError(error);
      })
    );
  }
}
