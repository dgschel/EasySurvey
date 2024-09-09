import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment.development';
import { HttpWrapper } from '../../util/type/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly apiUrl: string = environment.apiUrl;
  private http = inject(HttpClient);

  get<T>(endpoint: string, params?: any): Observable<HttpWrapper<T>> {
    return this.http
      .get<HttpWrapper<T>>(`${this.apiUrl}/${endpoint}`, { params })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      )
  }

  post<T>(endpoint: string, body: any): Observable<HttpWrapper<T>> {
    return this.http
      .post<HttpWrapper<T>>(`${this.apiUrl}/${endpoint}`, body)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      )
  }

  put<T>(endpoint: string, body: any): Observable<HttpWrapper<T>> {
    return this.http
      .put<HttpWrapper<T>>(`${this.apiUrl}/${endpoint}`, body)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string): Observable<HttpWrapper<T>> {
    return this.http
      .delete<HttpWrapper<T>>(`${this.apiUrl}/${endpoint}`)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
