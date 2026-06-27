import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { MedicineSchedule } from './pages/MedicineSchedule';
import { ScanMedicine } from './pages/ScanMedicine';
import { VerificationResult } from './pages/VerificationResult';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';

function Router() {
  const { page } = useApp();

  if (page === 'landing') return <Landing />;

  let content;
  switch (page) {
    case 'dashboard':
      content = <Dashboard />;
      break;
    case 'schedule':
      content = <MedicineSchedule />;
      break;
    case 'scan':
      content = <ScanMedicine />;
      break;
    case 'result':
      content = <VerificationResult />;
      break;
    case 'history':
      content = <History />;
      break;
    case 'settings':
      content = <Settings />;
      break;
    case 'profile':
      content = <Profile />;
      break;
    default:
      content = <Dashboard />;
  }

  return <AppLayout>{content}</AppLayout>;
}

function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

export default App;
