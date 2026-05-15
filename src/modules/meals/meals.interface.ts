export interface IMeal {
  id?: string;
  provider_id?: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  status?: 'AVAILABLE' | 'UNAVAILABLE';
  rating?: number;
  totalReviews?: number;
  featured?: boolean;
  trending?: boolean;
  orderCount?: number;
  discountPercent?: number;
  discountPrice?: number | null;
  offerText?: string | null;
  offerExpiresAt?: Date | string | null;
  isDiscounted?: boolean;
  preparationTime?: string | null;
  calories?: number | null;
  spiceLevel?: string | null;
  servingSize?: string | null;
  isAvailable?: boolean;
  ingredients?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMealQuery {
  featured?: string;
  trending?: string;
  isAvailable?: string;
  isDiscounted?: string;
  spiceLevel?: string;
  sortBy?: 'rating' | 'orderCount' | 'createdAt' | 'discountPercent' | 'price';
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
}
