import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/autenticacion';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NuevoExpediente from './pages/NuevoExpediente';
import DetalleExpediente from './pages/DetalleExpediente';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crear-expediente" element={<NuevoExpediente />} />
          <Route path="/expedientes/:id" element={<DetalleExpediente />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;