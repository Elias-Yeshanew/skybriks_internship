export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  createdDate?: string;
  vehicleCount?: number;
}

export interface Vehicle {
  id?: number;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  vinNumber?: string;
  customerId: number;
  customerName?: string;
}

export interface Mechanic {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  specialization?: string;
  hourlyRate?: number;
  status?: 'AVAILABLE' | 'BUSY' | 'ON_LEAVE';
  hiredDate?: string;
  activeJobs?: number;
}

export interface ServiceRequest {
  id?: number;
  vehicleId: number;
  vehicleInfo?: string;
  customerId?: number;
  customerName?: string;
  mechanicId?: number;
  mechanicName?: string;
  description: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  estimatedCost?: number;
  actualCost?: number;
  requestDate?: string;
  completionDate?: string;
  notes?: string;
  createdAt?: string;
}

export interface InventoryItem {
  id?: number;
  name: string;
  category: 'PARTS' | 'FLUIDS' | 'TOOLS' | 'OTHER';
  quantity: number;
  minQuantity: number;
  unitPrice?: number;
  supplier?: string;
  sku?: string;
  lowStock?: boolean;
  lastUpdated?: string;
}

export interface Invoice {
  id?: number;
  invoiceNumber?: string;
  serviceRequestId: number;
  serviceDescription?: string;
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  vehicleInfo?: string;
  laborCost?: number;
  partsCost?: number;
  taxAmount?: number;
  totalAmount?: number;
  issueDate?: string;
  dueDate?: string;
  status?: string;
  notes?: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalVehicles: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedThisMonth: number;
  revenueThisMonth: number;
  lowStockItems: number;
  monthlyRevenue: { month: string; revenue: number }[];
  recentRequests: ServiceRequest[];
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}
