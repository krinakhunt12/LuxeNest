
export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  isNew?: boolean;
  isSale?: boolean;
  isBestSeller?: boolean;
  colors: string[];
  materials: string[];
  dimensions?: {
    width: string;
    height: string;
    depth: string;
  };
  weight?: string;
  sku?: string;
  stock?: number;
  inStock?: boolean;
  brand?: string;
  warranty?: string;
  shippingTime?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
}

export interface UserReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface Address {
  _id?: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserPreferences {
  language: 'en' | 'hi' | 'es' | 'fr';
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';
  emailNotifications: boolean;
  smsNotifications: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  addresses: Address[];
  wishlist: string[];
  preferences: UserPreferences;
  emailVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

