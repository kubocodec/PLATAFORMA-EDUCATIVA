import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ModuleContent {
  id?: number;
  moduleId: number;
  title: string;
  description?: string;
  content?: string; // Para texto
  url?: string;     // Para descargas
  videoUrl?: string; // Para videos
  isLocalFile?: boolean;
  fileType?: string; // DRIVER, SOFTWARE, MANUAL, OTHER
  durationMinutes?: number;
  orderIndex?: number;
}

export interface CourseModule {
  id?: number;
  courseId: number;
  title: string;
  description?: string;
  type: string; // VIDEO, TEXT, DOCUMENT, QUIZ
  orderIndex?: number;
  active: boolean;
  videos?: ModuleContent[];
  texts?: ModuleContent[];
  downloads?: ModuleContent[];
}

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/modules`;

  getByCourse(courseId: number): Observable<CourseModule[]> {
    return this.http.get<CourseModule[]>(`${this.apiUrl}/course/${courseId}`);
  }

  getById(id: number): Observable<CourseModule> {
    return this.http.get<CourseModule>(`${this.apiUrl}/${id}`);
  }

  create(module: CourseModule): Observable<CourseModule> {
    return this.http.post<CourseModule>(this.apiUrl, module);
  }

  update(id: number, module: CourseModule): Observable<CourseModule> {
    return this.http.put<CourseModule>(`${this.apiUrl}/${id}`, module);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addVideo(video: ModuleContent): Observable<ModuleContent> {
    return this.http.post<ModuleContent>(`${this.apiUrl}/video`, video);
  }

  addText(text: ModuleContent): Observable<ModuleContent> {
    return this.http.post<ModuleContent>(`${this.apiUrl}/text`, text);
  }

  addDownload(link: ModuleContent): Observable<ModuleContent> {
    return this.http.post<ModuleContent>(`${this.apiUrl}/download`, link);
  }

  updateVideo(id: number, video: ModuleContent): Observable<ModuleContent> {
    return this.http.put<ModuleContent>(`${this.apiUrl}/video/${id}`, video);
  }

  updateText(id: number, text: ModuleContent): Observable<ModuleContent> {
    return this.http.put<ModuleContent>(`${this.apiUrl}/text/${id}`, text);
  }

  updateDownload(id: number, link: ModuleContent): Observable<ModuleContent> {
    return this.http.put<ModuleContent>(`${this.apiUrl}/download/${id}`, link);
  }
}
