export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "momo" | "om" | "card" | "cash";

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productVariantId: number | null;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  id: number;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export interface OrderPayment {
  id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string | null;
  createdAt: string;
}

export interface OrderDelivery {
  id: number;
  deliveryCode: string;
  status: string;
  livreurId: number | null;
  zoneId: number | null;
  livreur?: { id: number; name: string; phone: string | null } | null;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  shippingAddress: ShippingAddress | null;
  payments: OrderPayment[];
  deliveries: OrderDelivery[];
}
