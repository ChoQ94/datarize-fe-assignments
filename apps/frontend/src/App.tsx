import PurchaseFrequencyChart from './components/PurchaseFrequencyChart'
import CustomerList from './components/CustomerList'
import './App.css'

function App() {
  return (
    <>
      <PurchaseFrequencyChart />
      <hr className="divider" />
      <CustomerList />
    </>
  )
}

export default App
