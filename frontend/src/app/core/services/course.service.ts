import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Course {
  id?: number;
  brandId: number;
  brandName?: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  orderIndex?: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;

  getAll(activeOnly: boolean = false): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}?activeOnly=${activeOnly}`);
  }

  getByBrand(brandId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/brand/${brandId}`);
  }

  getById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  create(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  update(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
