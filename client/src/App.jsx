import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#334155',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '12px 16px',
              fontSize: '14px',
            },
          }}
        />
        <Navbar />
        <main className="flex-grow">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
