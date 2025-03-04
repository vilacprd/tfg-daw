import { Outlet } from 'react-router-dom';
import Sidebar from "../Sidebar/Sidebar";
import { useUser } from "../../context/userContext";

export default function DashboardWrapper() {
    const { logout, usuario } = useUser();
    
    
    return (
        <div className="w-screen h-screen fixed grid grid-cols-[250px_1fr] bg-cream">
            <Sidebar />
            <div className="flex flex-col overflow-scroll overflow-x-hidden text-beef">
                
                <nav className="pl-[2vw] max-h-[90px] font-flame grow w-full box-border border-b border-beef/10 bg-cream-dark flex items-center justify-between gap-3 px-[4vw] py-[10px]">
                    
                    <div className='flex flex-col  gap-[2px] items-start'>
                        <h2 className='font-flameSans text-xl'>Bienvenid@ {usuario.nombre} - {usuario.rol}</h2>
                        <h2 className='font-flameSans'>Nº de Empleado: {usuario.id ? usuario.id.toString().padStart(5, '0') : '-----'}</h2>
                    </div>
                    

                    <div className='uppercase text-lg font-flameSans w-12 bg-beef-light text-cream aspect-square rounded-full grid place-items-center'>
                        <span className='block'>
                        {usuario.rol.slice(0,2)}
                        </span>
                    </div>
                </nav>
                <div className='w-full min-h-8 bg-cream-dark' />
                
                <div className="grow">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}