export type {
  User,
  Account,
  Session,
  Business,
  BusinessUser,
  Customer,
  Product,
  Inventory,
  Order,
  OrderItem,
  Expense,
  Invoice,
  Task,
  Campaign,
  Notification,
  AIInsight,
  BusinessMetric,
} from '@prisma/client';

export type {
  UserRole,
  CustomerType,
  ProductStatus,
  OrderStatus,
  ExpenseStatus,
  InvoiceStatus,
  TaskStatus,
  Priority,
  CampaignType,
  CampaignStatus,
  NotificationType,
  InsightCategory,
  MetricType,
} from '@prisma/client';

// Custom Application Types

export interface BusinessData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  currency: string;
  timezone: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  activeCustomers: number;
  pendingOrders: number;
  inventoryValue: number;
}

export interface InsightData {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  actionable: boolean;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
