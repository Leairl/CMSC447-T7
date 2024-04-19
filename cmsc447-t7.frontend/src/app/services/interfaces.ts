export interface Item {
  id: number;
  userId: number;
  name?: string;
  price: number;
  createDate: Date;
  quantity: number;
  description?: string;
  imageURL?: string;
  user?: User;
  reviews?: ItemReview[];
  tags?: ItemTag[];
  receiptItems?: ReceiptItem[];
}

export interface Receipt {
  id: number;
  userId: number;
  addressId: number;
  createDate: Date;
  user?: User;
  address?: Address;
  receiptItems?: ReceiptItem[];
}


export interface ReceiptItem {
  id: number;
  itemId: number;
  receiptId: number;
  quantity: number;
  item?: Item;
  receipt?: Receipt;
}

export interface Address {
  id: number;
  city?: string;
  street1?: string;
  street2?: string;
  state?: string;
  zip?: string;
  billingAddressUser?: User;
  shippingAddressUser?: User;
  receipts?: Receipt[];
}

export interface User {
  id: number;
  username?: string;
  passwordHash?: string;
  email?: string;
  shippingAddressId: number;
  billingAddressId: number;
  shippingAddress?: Address;
  billingAddress?: Address;
  createdReviews?: UserReview[];
  userReviews?: UserReview[];
  itemReviews?: ItemReview[];
  receipts?: Receipt[];
  items?: Item[];
}

export interface UserReview {
  id: number;
  userId: number;
  reviewerUserId: number;
  createDate: Date;
  rating: number;
  comment?: string;
  reviewedUser?: User;
  reviewerUser?: User;
}

export interface ItemReview {
  id: number;
  userId: number;
  itemId: number;
  createDate: Date;
  rating: number;
  comment?: string;
  user?: User;
  item?: Item;
}
export interface ItemTag {
  id: number;
  itemId: number;
  tag?: string;
  item?: Item;
}
