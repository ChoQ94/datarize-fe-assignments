import { apiClient } from './client'

export interface Frequency {
  range: string
  count: number
}

interface GetPurchaseFrequencyParams {
  from?: string
  to?: string
}

export const getPurchaseFrequency = (params?: GetPurchaseFrequencyParams): Promise<Frequency[]> => {
  const query = new URLSearchParams()
  if (params?.from) {
    query.append('from', params.from)
  }
  if (params?.to) {
    query.append('to', params.to)
  }
  return apiClient(`/api/purchase-frequency?${query.toString()}`)
}
