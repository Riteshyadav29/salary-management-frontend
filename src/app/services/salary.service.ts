import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salary } from '../models/salary.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface SalaryFilters {
  search?: string;
  minBaseSalary?: number;
  maxBaseSalary?: number;
  minNetSalary?: number;
  maxNetSalary?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private apiUrl = `${environment.apiUrl}/api/salaries`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders();
  }

  getSalaries(filters?: SalaryFilters, page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'desc'): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.minBaseSalary !== undefined) {
      params = params.set('minBaseSalary', filters.minBaseSalary.toString());
    }
    if (filters?.maxBaseSalary !== undefined) {
      params = params.set('maxBaseSalary', filters.maxBaseSalary.toString());
    }
    if (filters?.minNetSalary !== undefined) {
      params = params.set('minNetSalary', filters.minNetSalary.toString());
    }
    if (filters?.maxNetSalary !== undefined) {
      params = params.set('maxNetSalary', filters.maxNetSalary.toString());
    }

    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders(), params });
  }

  getSalaryById(id: number): Observable<Salary> {
    return this.http.get<Salary>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createSalary(salary: Salary): Observable<Salary> {
    return this.http.post<Salary>(this.apiUrl, salary, { headers: this.getHeaders() });
  }

  updateSalary(id: number, salary: Salary): Observable<Salary> {
    return this.http.put<Salary>(`${this.apiUrl}/${id}`, salary, { headers: this.getHeaders() });
  }

  deleteSalary(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  exportCsv(filters?: SalaryFilters, sortBy: string = 'id', sortDir: string = 'desc'): Observable<Blob> {
    let params = new HttpParams()
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.minBaseSalary !== undefined) {
      params = params.set('minBaseSalary', filters.minBaseSalary.toString());
    }
    if (filters?.maxBaseSalary !== undefined) {
      params = params.set('maxBaseSalary', filters.maxBaseSalary.toString());
    }
    if (filters?.minNetSalary !== undefined) {
      params = params.set('minNetSalary', filters.minNetSalary.toString());
    }
    if (filters?.maxNetSalary !== undefined) {
      params = params.set('maxNetSalary', filters.maxNetSalary.toString());
    }

    return this.http.get<Blob>(`${this.apiUrl}/export`, { 
      headers: this.getHeaders(), 
      params,
      responseType: 'blob' as 'json'
    });
  }
}