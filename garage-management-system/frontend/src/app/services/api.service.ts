import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Customer, Vehicle, Mechanic, ServiceRequest,
  InventoryItem, Invoice, DashboardStats, AuthResponse
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // Auth
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, { username, password });
  }

  // Customers
  getCustomers(search?: string): Observable<Customer[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Customer[]>(`${this.base}/customers`, { params });
  }
  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.base}/customers/${id}`);
  }
  createCustomer(c: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.base}/customers`, c);
  }
  updateCustomer(id: number, c: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.base}/customers/${id}`, c);
  }
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/customers/${id}`);
  }
  getCustomerVehicles(id: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.base}/customers/${id}/vehicles`);
  }

  // Vehicles
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.base}/vehicles`);
  }
  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.base}/vehicles/${id}`);
  }
  createVehicle(v: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.base}/vehicles`, v);
  }
  updateVehicle(id: number, v: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.base}/vehicles/${id}`, v);
  }
  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/vehicles/${id}`);
  }

  // Mechanics
  getMechanics(): Observable<Mechanic[]> {
    return this.http.get<Mechanic[]>(`${this.base}/mechanics`);
  }
  getAvailableMechanics(): Observable<Mechanic[]> {
    return this.http.get<Mechanic[]>(`${this.base}/mechanics/available`);
  }
  createMechanic(m: Mechanic): Observable<Mechanic> {
    return this.http.post<Mechanic>(`${this.base}/mechanics`, m);
  }
  updateMechanic(id: number, m: Mechanic): Observable<Mechanic> {
    return this.http.put<Mechanic>(`${this.base}/mechanics/${id}`, m);
  }
  deleteMechanic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/mechanics/${id}`);
  }

  // Service Requests
  getServiceRequests(status?: string): Observable<ServiceRequest[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<ServiceRequest[]>(`${this.base}/service-requests`, { params });
  }
  getServiceRequest(id: number): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${this.base}/service-requests/${id}`);
  }
  createServiceRequest(sr: ServiceRequest): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(`${this.base}/service-requests`, sr);
  }
  updateServiceStatus(id: number, payload: any): Observable<ServiceRequest> {
    return this.http.patch<ServiceRequest>(`${this.base}/service-requests/${id}/status`, payload);
  }
  assignMechanic(id: number, mechanicId: number): Observable<ServiceRequest> {
    return this.http.patch<ServiceRequest>(`${this.base}/service-requests/${id}/assign/${mechanicId}`, {});
  }
  deleteServiceRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/service-requests/${id}`);
  }

  // Inventory
  getInventory(search?: string, category?: string): Observable<InventoryItem[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);
    return this.http.get<InventoryItem[]>(`${this.base}/inventory`, { params });
  }
  getLowStock(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.base}/inventory/low-stock`);
  }
  createInventoryItem(i: InventoryItem): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${this.base}/inventory`, i);
  }
  updateInventoryItem(id: number, i: InventoryItem): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.base}/inventory/${id}`, i);
  }
  adjustInventory(id: number, delta: number): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.base}/inventory/${id}/adjust`, { delta });
  }
  deleteInventoryItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/inventory/${id}`);
  }

  // Invoices
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.base}/invoices`);
  }
  getInvoice(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.base}/invoices/${id}`);
  }
  generateInvoice(req: any): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.base}/invoices`, req);
  }
  markInvoicePaid(id: number): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.base}/invoices/${id}/pay`, {});
  }

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/dashboard/stats`);
  }
}
