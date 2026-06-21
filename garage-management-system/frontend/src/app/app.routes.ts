import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'customers', loadComponent: () => import('./components/customers/customer-list.component').then(m => m.CustomerListComponent) },
      { path: 'vehicles', loadComponent: () => import('./components/vehicles/vehicle-list.component').then(m => m.VehicleListComponent) },
      { path: 'service-requests', loadComponent: () => import('./components/service-requests/service-request-list.component').then(m => m.ServiceRequestListComponent) },
      { path: 'mechanics', loadComponent: () => import('./components/mechanics/mechanic-list.component').then(m => m.MechanicListComponent) },
      { path: 'inventory', loadComponent: () => import('./components/inventory/inventory-list.component').then(m => m.InventoryListComponent) },
      { path: 'invoices', loadComponent: () => import('./components/invoices/invoice-list.component').then(m => m.InvoiceListComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
