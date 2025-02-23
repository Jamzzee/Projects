import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import GlobalStyles from './styles/GlobalStyles';
import AppLayout from './ui/AppLayout';
import ProtectedRoute from './ui/ProtectedRoute';
import { DarkModeProvider } from './features/context/DarkModeContext';
import Spinner from './ui/Spinner';

// Implement lazy loading for decrease larger chunks
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Account = React.lazy(() => import('./pages/Account'));
const Bookings = React.lazy(() => import('./pages/Bookings'));
const Cabins = React.lazy(() => import('./pages/Cabins'));
const Login = React.lazy(() => import('./pages/Login'));
const PageNotFound = React.lazy(() => import('./pages/PageNotFound'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Users = React.lazy(() => import('./pages/Users'));
const Booking = React.lazy(() => import('./pages/Booking'));
const Checkin = React.lazy(() => import('./pages/Checkin'));

// import Dashboard from './pages/Dashboard';
// import Account from './pages/Account';
// import Bookings from './pages/Bookings';
// import Cabins from './pages/Cabins';
// import Login from './pages/Login';
// import PageNotFound from './pages/PageNotFound';
// import Settings from './pages/Settings';
// import Users from './pages/Users';
// import Booking from './pages/Booking';
// import Checkin from './pages/Checkin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000, //Time for updating page or when it is actually re-fresh
      staleTime: 0, // Data always be update
    },
  },
});

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <GlobalStyles />
        <BrowserRouter>
          <React.Suspense fallback={<Spinner />}>
            <Routes>
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="bookings/:bookingId" element={<Booking />} />
                <Route path="checkin/:bookingId" element={<Checkin />} />
                <Route path="cabins" element={<Cabins />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
                <Route path="account" element={<Account />} />
              </Route>

              <Route path="login" element={<Login />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </React.Suspense>
        </BrowserRouter>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: '8px' }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: '16px',
              maxWidth: '500px',
              padding: '16px 24px',
              backgroundColor: 'var(--color-grey-0)',
              color: 'var(--color-grey-700)',
            },
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
