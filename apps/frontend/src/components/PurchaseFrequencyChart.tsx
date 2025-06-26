import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { getPurchaseFrequency, Frequency } from '../api/purchaseFrequency'
import styles from './PurchaseFrequencyChart.module.css'

const formatXAxisLabel = (value: string) => {
  if (typeof value !== 'string') return ''
  const parts = value.split(' - ')
  const min = parseInt(parts[0], 10)
  const max = parseInt(parts[1], 10)

  if (!isNaN(min) && !isNaN(max)) {
    const minLabel = min === 0 ? '0' : `${Math.floor(min / 10000)}`
    const maxLabel = `${max / 10000}`
    return `${minLabel}~${maxLabel}`
  }
  return value
}

const PurchaseFrequencyChart = () => {
  const [data, setData] = useState<Frequency[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 최초 데이터 조회
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const result = await getPurchaseFrequency()
        setData(result)
      } catch (err) {
        setError('초기 데이터를 불러오는 데 실패했습니다.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError('시작 날짜와 종료 날짜를 모두 선택해주세요.')
      return
    }
    if (startDate > endDate) {
      setError('시작 날짜는 종료 날짜보다 이전이거나 같아야 합니다.')
      return
    }

    try {
      setError(null)
      setLoading(true)
      // 종료 날짜를 해당 일의 끝 시간으로 설정
      const adjustedEndDate = new Date(endDate)
      adjustedEndDate.setHours(23, 59, 59, 999)

      const params = {
        from: startDate.toISOString(),
        to: adjustedEndDate.toISOString(),
      }
      const result = await getPurchaseFrequency(params)
      setData(result)
    } catch (err) {
      setError('데이터를 불러오는 데 실패했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>가격대별 구매 빈도 차트</h2>
      <div className={styles.controls}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Start Date"
          dateFormat="yyyy-MM-dd"
        />
        <div className={styles.datePickerGap} />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="End Date"
          dateFormat="yyyy-MM-dd"
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          조회
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {loading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : (
        <BarChart
          width={1000}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="range"
            textAnchor="middle"
            height={60}
            tickFormatter={formatXAxisLabel}
            label={{ value: '단위: 만원', position: 'insideRight', dy: 10 }}
          />
          <YAxis label={{ value: '구매 수', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="구매 수" />
        </BarChart>
      )}
    </div>
  )
}

export default PurchaseFrequencyChart
