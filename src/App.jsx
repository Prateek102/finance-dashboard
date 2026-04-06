import { FinanceProvider, useFinance } from './context/FinanceContext'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import DashboardView from './components/dashboard/DashboardView'
import TransactionsView from './components/transactions/TransactionsView'
import InsightsView from './components/insights/InsightsView'

function AppContent() {
  const { activeView } = useFinance()
  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />
      <main className="pt-14 pl-[220px] min-h-screen">
        <div className="max-w-5xl mx-auto p-5 lg:p-6" key={activeView}>
          {activeView === 'dashboard'    && <DashboardView />}
          {activeView === 'transactions' && <TransactionsView />}
          {activeView === 'insights'     && <InsightsView />}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  )
}
