import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import RequestLoan from "./pages/RequestLoan";
import Page from "./app/dashboard/page";
import Statistics from "./pages/Statistics";
import Wallet from "./pages/Wallet";
import History from "./pages/History";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignUp from "./pages/SignUp";
import { Toaster } from "./components/ui/toaster";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SignIn from "./pages/SignIn";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Sent from "./pages/Sent";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <ThemeProvider>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="app" element={<Page />}>
                <Route index element={<Navigate to="wallet" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="sent" element={<Sent />} />
                <Route path="deposit" element={<Deposit />} />
                <Route path="withdraw" element={<Withdraw />} />
                <Route path="request-loan" element={<RequestLoan />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="history" element={<History />} />
                <Route path="notifications" element={<Notifications />} />
              </Route>
              <Route path="signup" element={<SignUp />} />
              <Route path="/" element={<SignIn />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
