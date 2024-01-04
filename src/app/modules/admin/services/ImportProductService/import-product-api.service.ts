import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportProductApiService {
  API_URL = environment.serverUrl;

  constructor(private http: HttpClient) { }

  saveImportProduct(importProduct: any): Observable<any> {
    return this.http.post(`${this.API_URL}/storage`, importProduct)
  }
}
