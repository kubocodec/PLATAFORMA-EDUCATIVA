import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    children: [
      { path: 'brands', loadComponent: () => import('./features/admin/pages/manage-brands/manage-brands.component').then(m => m.ManageBrandsComponent) },
      { path: 'courses', loadComponent: () => import('./features/admin/pages/manage-courses/manage-courses.component').then(m => m.ManageCoursesComponent) },
      { path: 'courses/:courseId/modules', loadComponent: () => import('./features/admin/pages/manage-modules/manage-modules.component').then(m => m.ManageModulesComponent) },
      { path: 'courses/:courseId/quiz', loadComponent: () => import('./features/admin/pages/manage-quiz/manage-quiz.component').then(m => m.ManageQuizComponent) },
      { path: '', redirectTo: 'brands', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/courses/pages/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      },
      {
        path: 'brand/:brandId/courses',
        loadComponent: () => import('./features/courses/pages/course-catalog/course-catalog.component').then(m => m.CourseCatalogComponent)
      },
      {
        path: 'course/:courseId/view',
        loadComponent: () => import('./features/courses/pages/course-view/course-view.component').then(m => m.CourseViewComponent)
      },
      {
        path: 'take-quiz/:courseId',
        loadComponent: () => import('./features/courses/pages/take-quiz/take-quiz.component').then(m => m.TakeQuizComponent)
      },
      {
        path: 'certificates',
        loadComponent: () => import('./features/courses/pages/certificate-viewer/certificate-viewer.component').then(m => m.CertificateViewerComponent)
      }
    ]
  }
];
