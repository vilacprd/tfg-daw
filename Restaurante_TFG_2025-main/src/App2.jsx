import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DashboardWrapper from "./components/DashboardWrapper/DashboardWrapper";
import { useUser } from "./context/userContext";
import Login from "./components/Login/Login";
import Productos from './components/Productos/Productos';
import Categorias from './components/Categorias/Categorias';
import Ingredientes from './components/Ingredientes/Ingredientes';
import Usuarios from './components/Usuarios/Usuarios'
import Comandas from './components/Comandas/Comandas';
import Dashboard from './components/Dashboard/Dashboard';

// Este componente protege las rutas que requieren login
const PrivateRoute = ({ allowedRoles }) => {
    const { usuario, isAuthenticated } = useUser();
   
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
   
    if (allowedRoles && !allowedRoles.includes(usuario.rol)) {
      return <Navigate to="/dashboard" replace />;
    }
   
    return <Outlet />;
};

const App = () => {
    const { isAuthenticated } = useUser();

    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta del login */}
                <Route 
                    path="/login" 
                    element={
                        isAuthenticated ? 
                            <Navigate to="/dashboard" replace /> : 
                            <Login />
                    } 
                />

                {/* Ruta principal */}
                <Route 
                    path="/" 
                    element={
                        isAuthenticated ? 
                            <Navigate to="/dashboard" replace /> : 
                            <Navigate to="/login" replace />
                    } 
                />

                {/* Rutas protegidas dentro de la dashboard */}
                <Route element={<PrivateRoute />}>
                    <Route element={<DashboardWrapper />}>
                        <Route path="/dashboard">
                            <Route index element={<Dashboard />} />
                            <Route path="productos" element={<PrivateRoute allowedRoles={['admin','encargado']} />}>
                                <Route index element={<Productos/>} />
                            </Route>
                            <Route path="categorias" element={<PrivateRoute allowedRoles={['admin','encargado']} />}>
                                <Route index element={<Categorias/>} />
                            </Route>
                            <Route path="ingredientes" element={<PrivateRoute allowedRoles={['admin','encargado']} />}>
                                <Route index element={<Ingredientes/>} />
                            </Route>
                            <Route path="comandas" element={<PrivateRoute allowedRoles={['admin','encargado','camarero']} />}>
                                <Route index element={<Comandas/>} />
                            </Route>
                            <Route path="usuarios" element={<PrivateRoute allowedRoles={['admin']} />}>
                                <Route index element={<Usuarios />} />
                            </Route>
                            { /*404*/ }
                            <Route 
                                path="*" 
                                element={
                                    <Dashboard />
                                } 
                            />
                        </Route>
                        <Route path="*" 
                                element={
                                    <Dashboard />
                                } />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;