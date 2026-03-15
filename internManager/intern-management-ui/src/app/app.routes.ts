import { Routes } from '@angular/router';
import { BatchManagement } from './components/batch-management/batch-management';
import { InternManagement } from './components/intern-management/intern-management';
import { InternList } from './components/intern-list/intern-list';

export const routes: Routes = [
  { path: 'batches', component: BatchManagement },
  { path: 'register', component: InternManagement },
  { path: 'edit/:id', component: InternManagement },
  { path: 'interns', component: InternList },
  { path: '', redirectTo: '/interns', pathMatch: 'full' }
];