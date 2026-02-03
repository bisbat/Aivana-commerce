export interface CreateReviewDTO {
  rating: number;
  comment?: string;
}

export interface ReviewUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  username: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: ReviewUser;
}

export interface ReviewResponse {
  reviews: Review[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
