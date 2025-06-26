import { useState, useEffect } from 'react'
import { getCustomerPurchases, Purchase } from '../api/customers'
import styles from './CustomerList.module.css'

interface PurchaseDetailsProps {
  customerId: number
}

const PurchaseDetails = ({ customerId }: PurchaseDetailsProps) => {
  const [purchaseDetails, setPurchaseDetails] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (customerId === null) return

    const fetchPurchaseDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getCustomerPurchases(customerId)
        setPurchaseDetails(data)
      } catch (err) {
        setError('상세 구매 내역을 불러오는 데 실패했습니다.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchaseDetails()
  }, [customerId])

  if (loading) {
    return <div className={styles.message}>상세 내역 로딩 중...</div>
  }

  if (error) {
    return <div className={`${styles.message} ${styles.error}`}>{error}</div>
  }

  return (
    <table className={styles.detailsTable}>
      <thead>
        <tr>
          <th>구매날짜</th>
          <th>상품이미지</th>
          <th>상품명</th>
          <th>수량</th>
          <th>총 가격</th>
        </tr>
      </thead>
      <tbody>
        {purchaseDetails.map((purchase, index) => (
          <tr key={index}>
            <td>{new Date(purchase.date).toISOString().slice(0, 10) || '-'}</td>
            <td>{purchase.imgSrc ? <img src={purchase.imgSrc} alt={purchase.product} width="50" /> : '-'}</td>
            <td>{purchase.product || '-'}</td>
            <td>{purchase.quantity || '-'}</td>
            <td>{purchase.price.toLocaleString() || '-'}원</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default PurchaseDetails
