import { apiClient } from './client'

export interface Customer {
  id: number
  name: string
  count: number
  totalAmount: number
}

export interface Purchase {
  date: string
  quantity: number
  product: string
  price: number
  imgSrc: string
}

interface GetCustomersParams {
  sortBy?: 'asc' | 'desc'
  name?: string
}
// 고객 목록을 반환
export const getCustomers = (params?: GetCustomersParams): Promise<Customer[]> => {
  const query = new URLSearchParams()
  if (params?.sortBy) {
    query.append('sortBy', params.sortBy)
  }
  if (params?.name) {
    query.append('name', params.name)
  }
  return apiClient(`/api/customers?${query.toString()}`)
}

// 특정 고객의 구매 목록 반환
export const getCustomerPurchases = (id: number): Promise<Purchase[]> => {
  return apiClient(`/api/customers/${id}/purchases`)
}
