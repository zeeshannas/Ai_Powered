import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CodeAssistant from "./pages/CodeAssistant";
import EmailAssistant from "./pages/EmailAssistant";
import History from "./pages/History"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="code-assistant" element={<CodeAssistant />} />
          <Route path="email-assistant" element={<EmailAssistant />} />
          <Route path="/history" element={<History/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
