import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DashboardWrapper from "./components/DashboardWrapper/DashboardWrapper";
import { useUser } from "./context/userContext";
import Login from "./components/Login/Login";
import ListaProductos from './productos/ListaProductos';
import Categorias from './categorias/Categorias';
import Ingredientes from './ingredientes/Ingredientes';
import Usuarios from './Users/Usuarios';
import Comandas from './comandas/Comandas';
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
                            <Route path="productos" element={<ListaProductos />} />
                            <Route path="categorias" element={<Categorias />} />
                            <Route path="ingredientes" element={<Ingredientes />} />
                            <Route 
                                path="comandas" 
                                element={
                                    <PrivateRoute allowedRoles={['admin', 'encargado']}>
                                        <Comandas />
                                    </PrivateRoute>
                                } 
                            />
                            <Route 
                                path="usuarios" 
                                element={
                                    <PrivateRoute allowedRoles={['admin']}>
                                        <Usuarios />
                                    </PrivateRoute>
                                } 
                            />
                            { /*404*/ }
                            <Route 
                                path="*" 
                                element={
                                    <h3>404</h3>
                                } 
                            />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;