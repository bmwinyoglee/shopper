export interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  description: string
  longDescription: string
  image: string
  images: string[]
  category: string
  tags: string[]
  rating: number
  reviews: number
  inStock: boolean
  featured?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  subtotal: number
  shipping: number
  customer: CustomerInfo
  status: 'processing' | 'shipped' | 'delivered'
  createdAt: string
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  zip: string
}
