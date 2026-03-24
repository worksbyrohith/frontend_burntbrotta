export interface User {
    userId: number;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
}

export interface AuthResponse {
    token: string;
    role: string;
    userId: number;
}

export interface Restaurant {
    restaurantId: number;
    name: string;
    address: string;
    phone: string;
    imageUrl?: string;
    isActive: boolean;
}

export interface MenuItem {
    itemId: number;
    restaurantId: number;
    name: string;
    description?: string;
    price: number;
    category: string;
    isAvailable: boolean;
}

export interface OrderItem {
    orderItemId: number;
    orderId: number;
    itemId: number;
    menuItem?: MenuItem;
    quantity: number;
    unitPrice: number;
}

export interface Order {
    orderId: number;
    userId: number;
    user?: User;
    restaurantId: number;
    restaurant?: Restaurant;
    totalAmount: number;
    status: string;
    deliveryAddress: string;
    orderedAt: Date;
    orderItems: OrderItem[];
    payment?: Payment;
}

export interface Payment {
    paymentId: number;
    orderId: number;
    amount: number;
    method: string;
    status: string;
    paidAt?: Date;
}

// DTOs
export interface RestaurantCreateDto {
    name: string;
    address: string;
    phone: string;
    imageUrl?: string;
}

export interface MenuItemCreateDto {
    restaurantId: number;
    name: string;
    description?: string;
    price: number;
    category: string;
}

export interface OrderItemCreateDto {
    itemId: number;
    quantity: number;
}

export interface OrderCreateDto {
    restaurantId: number;
    deliveryAddress: string;
    items: OrderItemCreateDto[];
}

export interface DashboardDto {
    totalOrdersToday: number;
    totalRevenue: number;
    activeRestaurantsCount: number;
    pendingOrdersCount: number;
}

export interface UserDto {
    userId: number;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
}
