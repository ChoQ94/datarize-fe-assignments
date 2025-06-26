import { useState, useEffect, Fragment } from 'react'
import { getCustomers, Customer } from '../api/customers'
import styles from './CustomerList.module.css'
import PurchaseDetails from './PurchaseDetails'

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | undefined>(undefined)
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const params = {
          name: searchQuery || undefined,
          sortBy: sortBy,
        }
        const data = await getCustomers(params)
        setCustomers(data)
        setError(null)
      } catch (err) {
        setError('고객 정보를 불러오는 데 실패했습니다.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [searchQuery, sortBy])

  const handleRowClick = (customerId: number) => {
    if (selectedCustomerId === customerId) {
      setSelectedCustomerId(null) // Toggle off if the same row is clicked
    } else {
      setSelectedCustomerId(customerId)
    }
  }

  const handleSearch = () => {
    setSearchQuery(searchTerm)
  }

  return (
    <div>
      <h2>고객 목록</h2>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="이름으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>검색</button>
        <button onClick={() => setSortBy('desc')}>구매액 높은 순</button>
        <button onClick={() => setSortBy('asc')}>구매액 낮은 순</button>
        <button
          onClick={() => {
            setSortBy(undefined)
            setSearchTerm('')
            setSearchQuery('')
          }}
        >
          초기화
        </button>
      </div>
      {loading && <div className={styles.loading}>로딩 중...</div>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>총 구매 횟수</th>
              <th>총 구매 금액</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <Fragment key={customer.id}>
                <tr
                  onClick={() => handleRowClick(customer.id)}
                  className={`${styles.clickableRow} ${selectedCustomerId === customer.id ? styles.selectedRow : ''}`}
                >
                  <td>{customer.id || '-'}</td>
                  <td>{customer.name || '-'}</td>
                  <td>{customer.count != null ? customer.count.toLocaleString() : '-'}</td>
                  <td>{customer.totalAmount != null ? `${customer.totalAmount.toLocaleString()}원` : '-'}</td>
                </tr>
                {selectedCustomerId === customer.id && (
                  <tr>
                    <td colSpan={4}>
                      <PurchaseDetails customerId={selectedCustomerId} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default CustomerList
