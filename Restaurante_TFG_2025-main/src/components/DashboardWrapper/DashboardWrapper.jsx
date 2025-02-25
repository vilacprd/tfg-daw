import { Outlet } from 'react-router-dom';
import Sidebar from "../Sidebar/Sidebar";
import { useUser } from "../../context/userContext";

export default function DashboardWrapper() {
    const { logout, usuario } = useUser();
    
    
    return (
        <div className="w-screen h-screen fixed grid grid-cols-[250px_1fr] bg-cream">
            <Sidebar />
            <div className="flex flex-col">
                
                <nav className="max-h-[90px] font-flame grow w-full box-border border-b border-beef/10 bg-cream-dark flex items-center justify-end gap-3 px-[4vw]">
                    
                    {/* Este boton de cerrar sesion solo tiene que aparecer para los admins, la mesa cierra la sesion cuando pide la cuenta */}
                    <button className='group  h-12 px-4  aspect-square grid place-items-center bg-cream hover:bg-beef-light transition-colors  rounded-3xl text-cream-dark' onClick={logout}>
                        <svg style={{transform:"translateX(-4px"}} xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                            <path className='fill-beef-light transition-all group-hover:fill-cream' fillRule="evenodd" clipRule="evenodd" d="M13.775 9.50001C13.775 9.10652 13.456 8.78751 13.0625 8.78751H2.63857L4.50119 7.19098C4.79996 6.9349 4.83456 6.48509 4.57847 6.18633C4.32239 5.88755 3.87258 5.85295 3.57381 6.10905L0.248814 8.95908C0.0908865 9.09436 0 9.29206 0 9.50001C0 9.70797 0.0908865 9.90566 0.248814 10.0409L3.57381 12.8909C3.87258 13.1471 4.32239 13.1125 4.57847 12.8137C4.83456 12.5149 4.79996 12.0651 4.50119 11.8091L2.63857 10.2125H13.0625C13.456 10.2125 13.775 9.8935 13.775 9.50001Z" fill="#1C274C"/>
                            <path className='fill-beef-light transition-all group-hover:fill-cream' d="M7.36249 5.7C7.36249 6.36708 7.36249 6.70063 7.52257 6.94022C7.59189 7.04397 7.68098 7.13306 7.78472 7.20238C8.02435 7.36246 8.3579 7.36246 9.02499 7.36246H13.0625C14.243 7.36246 15.2 8.31943 15.2 9.5C15.2 10.6805 14.243 11.6375 13.0625 11.6375H9.02499C8.3579 11.6375 8.02426 11.6375 7.78467 11.7976C7.68096 11.8669 7.59191 11.9559 7.52261 12.0597C7.36249 12.2993 7.36249 12.6328 7.36249 13.3C7.36249 15.987 7.36249 17.3305 8.19725 18.1652C9.03202 19 10.3753 19 13.0623 19H14.0123C16.6993 19 18.0428 19 18.8775 18.1652C19.7123 17.3305 19.7123 15.987 19.7123 13.3V5.7C19.7123 3.013 19.7123 1.66949 18.8775 0.834746C18.0428 0 16.6993 0 14.0123 0H13.0623C10.3753 0 9.03202 0 8.19725 0.834746C7.36249 1.66949 7.36249 3.01299 7.36249 5.7Z" fill="#1C274C"/>
                        </svg>
                    </button>
                    {/* checkout button, solo tiene que aparecer para la mesa */}
                    <button className='bg-ketchup hover:bg-beef-light transition-colors w-12 aspect-square rounded-full grid place-items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 21 20" fill="none">
                            <path className='fill-cream' d="M20.9875 4.7523L19.8055 11.1804C19.708 11.7122 19.4247 12.1931 19.0052 12.5394C18.5856 12.8857 18.0564 13.0752 17.5099 13.075H6.23499L6.65925 15.3824H17.1111C17.6067 15.3821 18.0896 15.5379 18.4897 15.8271C18.8899 16.1163 19.1866 16.5239 19.3368 16.991C19.4871 17.458 19.4831 17.9602 19.3255 18.4249C19.1679 18.8896 18.8648 19.2926 18.4602 19.5756C18.0555 19.8586 17.5703 20.0069 17.0747 19.999C16.5791 19.9911 16.099 19.8275 15.7037 19.5317C15.3085 19.236 15.0186 18.8236 14.8762 18.3541C14.7338 17.8847 14.7462 17.3826 14.9116 16.9206H9.19956C9.3366 17.3025 9.36954 17.7133 9.29506 18.1118C9.22057 18.5103 9.04129 18.8823 8.77525 19.1905C8.5092 19.4987 8.16577 19.7323 7.7795 19.8676C7.39323 20.0029 6.97774 20.0352 6.57482 19.9613C6.1719 19.8874 5.79576 19.7099 5.48423 19.4467C5.1727 19.1834 4.93676 18.8437 4.80015 18.4616C4.66354 18.0796 4.63108 17.6687 4.70602 17.2703C4.78096 16.8719 4.96067 16.5001 5.22707 16.1922L2.53271 1.53824H0.777778C0.571498 1.53824 0.373667 1.4572 0.227806 1.31297C0.0819442 1.16873 0 0.9731 0 0.769118C0 0.565135 0.0819442 0.369507 0.227806 0.225269C0.373667 0.0810319 0.571498 1.50948e-07 0.777778 1.50948e-07H2.53271C2.89706 -0.000159431 3.24989 0.126218 3.52962 0.357073C3.80934 0.587928 3.99819 0.908595 4.06321 1.2631L4.53802 3.84559H20.2222C20.3361 3.8456 20.4487 3.87035 20.5519 3.9181C20.655 3.96585 20.7463 4.03543 20.8193 4.12192C20.8923 4.20841 20.9452 4.30969 20.9743 4.41862C21.0033 4.52755 21.0078 4.64146 20.9875 4.7523Z" fill="black"/>
                        </svg>
                    </button>

                    <div className='uppercase text-lg font-flameSans w-12 bg-beef-light text-cream aspect-square rounded-full grid place-items-center'>
                        <span className='block'>
                        {usuario.rol.slice(0,2)}
                        </span>
                    </div>
                </nav>
                <div className='w-full h-full max-h-8 bg-cream-dark ' />
                <div className="grow overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}