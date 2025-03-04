import { useEffect, useState } from 'react';
import { fetchUsuarios, deleteUsuario } from '../../connections/usuarios';
import CrearUsuarioModal from './CrearUsuarioModal'; 
import DashboardIntro from '../DashboardIntro/DashboardIntro';
import DashboardSectionWrapper from '../DashboardSectionWrapper/DashboardSectionWrapper';

export default function Usuarios(){
  const [usuarios, setUsuarios] = useState(null);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRoles, setFilterRoles] = useState({
    admin: false,
    encargado: false,
    camarero: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUsername, setDeleteUsername] = useState("");
  const [disableConfirm, setDisableConfirm] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // Usuario logueado

  useEffect(() => {
    fetchUsuariosData();
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("❌ Error al parsear usuario desde localStorage:", error);
      }
    }
  }, []);

  const fetchUsuariosData = async () => {
    try {
      const data = await fetchUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  };

  const handleDeleteRequest = (id, nombre, rol) => {
    if (currentUser && currentUser.id === id && rol === "admin") {
      setDeleteUserId(id);
      setDeleteUsername("");
      setDisableConfirm(true);
      setDeleteConfirm(true);
    } else {
      handleDelete(id);
    }
  };

  const handleOpenModal = () => {
    setUsuarioEdit(null); // Nos aseguramos de que no se pase un usuario para edición
    setShowModal(true);
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteUsuario(id);
      setUsuarios((prev) => prev.filter((user) => user.id !== id)); // Elimina del estado
      setDeleteConfirm(false);
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDelete(deleteUserId);
  
      // Si el usuario eliminado es el que está autenticado, cerrar sesión
      if (currentUser.id === deleteUserId) {
        localStorage.removeItem("usuario"); // Borra los datos del usuario
        localStorage.removeItem("token"); // Borra el token de autenticación
        setCurrentUser(null); // Limpia el estado del usuario
        window.location.reload(); // Recarga la página para ir al Login
      }
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
    }
  };
  
  const handleEdit = (usuario) => {
    setUsuarioEdit(usuario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioEdit(null);
    fetchUsuariosData();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setFilterRoles({
      ...filterRoles,
      [e.target.name]: e.target.checked,
    });
  };

  const handleUsernameInput = (e) => {
    setDeleteUsername(e.target.value);
    setDisableConfirm(e.target.value !== currentUser.nombre);
  };

  // Filtrado de usuarios por nombre y roles seleccionados
  const filteredUsuarios = usuarios=== null ? null : usuarios.filter((usuario) => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(search.toLowerCase());
    const selectedRoles = Object.keys(filterRoles).filter((role) => filterRoles[role]);
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(usuario.rol);
    return matchesSearch && matchesRole;
  });

  const vector = <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 27 20" fill="none"><path className="fill-cream" fillRule="evenodd" clipRule="evenodd" d="M3.99219 6C3.99219 2.68629 6.67848 0 9.99219 0C13.3059 0 15.9922 2.68629 15.9922 6C15.9922 9.31373 13.3059 12 9.99219 12C6.67848 12 3.99219 9.31373 3.99219 6Z" fill="white"></path><path className="fill-cream" d="M16.4815 9.41776C16.4208 9.53269 16.4466 9.67603 16.551 9.75336C17.3264 10.3274 18.286 10.6668 19.3248 10.6668C21.9022 10.6668 23.9915 8.57749 23.9915 6.00016C23.9915 3.42283 21.9022 1.3335 19.3248 1.3335C18.286 1.3335 17.3264 1.67296 16.551 2.247C16.4466 2.32434 16.4208 2.4676 16.4815 2.58255C17.02 3.60308 17.3248 4.76603 17.3248 6.00016C17.3248 7.23429 17.02 8.39723 16.4815 9.41776Z" fill="white"></path><path className="fill-cream" fillRule="evenodd" clipRule="evenodd" d="M3.51307 14.2659C5.15622 13.5527 7.31213 13.3335 9.99147 13.3335C12.6731 13.3335 14.8306 13.5531 16.4743 14.2679C18.2649 15.0464 19.3531 16.3726 19.9235 18.245C20.1909 19.1226 19.5317 20.0002 18.6233 20.0002H1.36222C0.452724 20.0002 -0.207863 19.1212 0.0602972 18.242C0.631457 16.3694 1.72138 15.0436 3.51307 14.2659Z" fill="white"></path><path className="fill-cream" d="M17.0833 12.0485C16.5313 12.0828 16.4989 12.8244 17.0061 13.0449C18.396 13.6493 19.4425 14.5391 20.1931 15.6747C20.8089 16.6065 21.7653 17.3333 22.8823 17.3333H25.2564C26.1993 17.3333 26.8873 16.3964 26.5556 15.4811C26.5365 15.4284 26.5167 15.3761 26.4961 15.3243C26.0396 14.1715 25.2571 13.3228 24.0984 12.7819C23.0105 12.274 21.6487 12.0644 20.0443 12.0011L20.0179 12H19.9916C19.0465 12 18.0595 11.9879 17.0833 12.0485Z" fill="white"></path></svg>

  if (filteredUsuarios === null) {
    return (
      <>
      <DashboardIntro bgColor='rgb(80 35 20 / 1)' title={"Usuarios"} vector={vector} />
    <DashboardSectionWrapper >
    <div className="ml-[0px] max-h-screen pointer-events-none">
      <div className='w-full flex justify-between items-start mb-6'>
        {/* Botón para crear nuevo usuario */}
        <button
 // ✅ Corrección aquí
          className="px-8 py-4 bg-beef-light animate-pulse font-flame text-xl text-cream rounded-3xl"
              >
                <span className='opacity-0'>Crear Nuevo Usuario</span>
          
        </button>

        {/* Filtros */}
      <div className="mb-4 p-4 bg-cream border border-beef/10 box-border rounded-md text-cream">

          {/* Buscar por nombre */}
          <div className='relative bg-beef rounded-md animate-pulse'>
            <input
              type="text"
              placeholder="Buscar por nombre..."
             
              className=" opacity-0 box-border pr-8 text-md p-2 rounded border placeholder-beef/80 focus:outline-none focus:border-beef/80 border-beef/10 w-full  bg-cream-dark font-flameSans text-beef"
            />
            <div className="opacity-0 absolute h-full w-8 grid place-items-center top-0 right-0"><svg xmlns="http://www.w3.org/2000/svg" width="19px" height="19px" viewBox="0 0 24 24" fill="none"><path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
          </div>
        

        {/* Filtrar por roles */}
        <div className="flex gap-4 text-beef mt-2">
            <label className="flex items-center gap-2 text-sm bg-beef rounded-md animate-pulse">
              <div className='relative opacity-0'>
                <input
                type="checkbox"
                name="admin"
                
                className="accent-beef p-0 opacity-0 checked:opacity-100 z-10 checked:z-40 relative checked:scale-110"
                />
                <div className="z-20 pointer-events-none absolute top-0 left-0 w-full h-full grid place-items-center "><div className="scale-105 aspect-square rounded-sm bg-cream box-border border border-beef/20 w-full"></div></div>
              </div>
            
            Administrador
          </label>
            <label className="flex items-center gap-2 text-sm bg-beef rounded-md animate-pulse">
            <div className='relative opacity-0'>
            <input
              type="checkbox"
              name="encargado"
             
              className="accent-beef p-0 opacity-0 checked:opacity-100 z-10 checked:z-40 relative checked:scale-110"
                />
                <div className="z-20 pointer-events-none absolute top-0 left-0 w-full h-full grid place-items-center "><div className="scale-105 aspect-square rounded-sm bg-cream box-border border border-beef/20 w-full"></div></div>
                </div>
            Encargado
          </label>
            <label className="flex items-center gap-2 text-sm bg-beef rounded-md animate-pulse">
            <div className='relative opacity-0'>
            <input
              type="checkbox"
              name="camarero"
             
              className="accent-beef p-0 opacity-0 checked:opacity-100 z-10 checked:z-40 relative checked:scale-110"
                />
                <div className="z-20 pointer-events-none absolute top-0 left-0 w-full h-full grid place-items-center "><div className="scale-105 aspect-square rounded-sm bg-cream box-border border border-beef/20 w-full"></div></div>
                </div>
            Camarero
          </label>
        </div>
      </div>
      </div>

      

      

      <div className="grid grid-cols-4 gap-5">
            {[...Array(12).fill(null)].map((usuario,index) => (
              
                <UsuarioCardSkeleton key={index}/>
            
          ))}
        </div>

      
    </div>
      </DashboardSectionWrapper>
      </>
    )
  } else {
    return (
      <>
      <DashboardIntro bgColor='rgb(80 35 20 / 1)' title={"Usuarios"} vector={vector} />
      <DashboardSectionWrapper >
      <div className="ml-[0px] max-h-screen">
        <div className='w-full flex justify-between items-start mb-6'>
          {/* Botón para crear nuevo usuario */}
          <button
            onClick={handleOpenModal}  // ✅ Corrección aquí
            className="px-8 py-4 bg-beef-light font-flame text-xl text-cream rounded-3xl"
          >
            Crear Nuevo Usuario
          </button>
  
          {/* Filtros */}
        <div className="mb-4 p-4 bg-cream border border-beef/10 box-border rounded-md text-cream">
  
            {/* Buscar por nombre */}
            <div className='relative'>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={handleSearchChange}
                className="box-border pr-8 text-md p-2 rounded border placeholder-beef/80 focus:outline-none focus:border-beef/80 border-beef/10 w-full  bg-cream-dark font-flameSans text-beef"
              />
              <div className="absolute h-full w-8 grid place-items-center top-0 right-0"><svg xmlns="http://www.w3.org/2000/svg" width="19px" height="19px" viewBox="0 0 24 24" fill="none"><path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
            </div>
          
  
          {/* Filtrar por roles */}
          <div className="flex gap-4 text-beef mt-2">
              <label className="flex items-center gap-2 text-sm">
                <div className='relative'>
                  <input
                  type="checkbox"
                  name="admin"
                  checked={filterRoles.admin}
                  onChange={handleRoleFilterChange}
                  className="accent-beef p-0 opacity-0 checked:opacity-100 z-10 checked:z-40 relative checked:scale-110"
                  />
                  <div className="z-20 pointer-events-none absolute top-0 left-0 w-full h-full grid place-items-center "><div className="scale-105 aspect-square rounded-sm bg-cream box-border border border-beef/20 w-full"></div></div>
                </div>
              
              Administrador
            </label>
              <label className="flex items-center gap-2 text-sm">
              <div className='relative'>
              <input
                type="checkbox"
                name="encargado"
                checked={filterRoles.encargado}
                onChange={handleRoleFilterChange}
                className="accent-beef p-0 opacity-0 checked:opacity-100 z-10 checked:z-40 relative checked:scale-110"
                  />
                  <div className="z-20 pointer-events-none absolute top-0 left-0 w-full h-full grid place-items-center "><div className="scale-105 aspect-square rounded-sm bg-cream box-border border border-beef/20 w-full"></div></div>
                  </div>
              Encargado
            </label>
              <label className="flex items-center gap-2 text-sm">
              <div className='relative'>
              <input
                type="checkbox"
                name="camarero"
                checked={filterRoles.camarero}
                onChange={handleRoleFilterChange}
                className="accent-beef p-0 opacity-0 checked:opacity-100 z-10 checked:z-40 relative checked:scale-110"
                  />
                  <div className="z-20 pointer-events-none absolute top-0 left-0 w-full h-full grid place-items-center "><div className="scale-105 aspect-square rounded-sm bg-cream box-border border border-beef/20 w-full"></div></div>
                  </div>
              Camarero
            </label>
          </div>
        </div>
        </div>
  
        
  
        
  
        {console.log(filteredUsuarios)}
        {/* Si no hay usuarios filtrados, mostrar mensaje */}
        {filteredUsuarios.length === 0 ? (
          <p className="text-beef text-xl font-flame">No hay usuarios disponibles.</p>
        ) : (
          <div className="grid grid-cols-4 gap-5">
              {filteredUsuarios.map((usuario) => (
                
                  <UsuarioCard key={usuario.id} usuario={usuario} onEdit={() => handleEdit(usuario)} onDelete={() => handleDeleteRequest(usuario.id, usuario.nombre, usuario.rol)} />
              
            ))}
          </div>
        )}
  
        {/* Modal para crear usuario */}
        {showModal && (
          <CrearUsuarioModal
            handleCloseModal={handleCloseModal}
            usuarioEdit={usuarioEdit}
          />
        )}
      </div>
        </DashboardSectionWrapper>
        </>
    );
  }
  
};


const UsuarioCard = ({ usuario, onDelete, onEdit }) => {
  let clase = "bg-lettuce/70"

  if (usuario.rol === "camarero") {
    clase = 'bg-cheddar/50'
  } else if (usuario.rol === 'encargado') {
    clase = "bg-mustard/90"
  }
  return (
    <div style={{aspectRatio:"1/0.52"}} className='box-border border border-beef/10 rounded-md p-4 flex gap-2 justify-between bg-cream-dark relative min-h-40 font-flameSans'>
      <div className='w-[80%]'>
        <div className='line-clamp-1'>
          <span className='rounded-sm  box-border text-bold text-xl mb-2 block capitalize font-flame'>{usuario.nombre}</span>
        </div>
        <div className='line-clamp-1'>
          <span className='font-bold'>Rol:</span> <span className={`${clase} rounded-full px-2 box-border py-1`}>{usuario.rol}</span>
        </div>
      </div>
      
      <div className='w-14 aspect-square rounded-full h-fit bg-beef text-xl text-cream grid place-items-center capitalize'>
          <span>{usuario.nombre.slice(0,2)}</span>
      </div>

      <div className="absolute z-10 bottom-2 right-2 flex gap-2 justify-end bg-cream box-border rounded-lg p-2 w-fit">
        
        <button onClick={onEdit} className="group h-10 aspect-square bg-cheddar rounded-md grid place-items-center group">
          <svg className="group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path className="stroke-cream" d="M20.197 5.46736L10.6982 14.9661C9.75225 15.912 6.94439 16.3502 6.31711 15.7229C5.68982 15.0956 6.11797 12.2878 7.06387 11.3419L16.5727 1.83308C16.8072 1.57725 17.091 1.3716 17.4073 1.22852C17.7234 1.08544 18.0653 1.00788 18.4123 1.00057C18.7592 0.99327 19.1041 1.05634 19.426 1.18598C19.7479 1.31563 20.0403 1.50919 20.2853 1.75493C20.5303 2.00066 20.7231 2.2935 20.8519 2.61576C20.9806 2.93803 21.0428 3.28304 21.0346 3.62998C21.0263 3.97693 20.9477 4.31864 20.8039 4.63442C20.6599 4.9502 20.4535 5.23356 20.197 5.46736Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path className="stroke-cream" d="M9.96117 3.07764H4.98274C3.92645 3.07764 2.91349 3.49724 2.16657 4.24415C1.41967 4.99106 1 6.00409 1 7.06038V17.0172C1 18.0736 1.41967 19.0866 2.16657 19.8334C2.91349 20.5804 3.92645 21 4.98274 21H15.9353C18.1357 21 18.9223 19.2077 18.9223 17.0172V12.0388" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
        <button onClick={onDelete} className="group h-10 aspect-square bg-beef rounded-md grid place-items-center group">
          <svg className="group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
            <path className="stroke-cream" d="M7.66602 9.88867V16.5553" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path className="stroke-cream" d="M12.1113 9.88867V16.5553" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path className="stroke-cream" d="M1 5.44434H18.7778" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path className="stroke-cream" d="M3.22266 5.44434H9.88932H16.556V17.6666C16.556 19.5076 15.0637 20.9999 13.2227 20.9999H6.55599C4.71504 20.9999 3.22266 19.5076 3.22266 17.6666V5.44434Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path className="stroke-cream" d="M6.55469 3.22222C6.55469 1.99492 7.54961 1 8.77691 1H10.9991C12.2265 1 13.2214 1.99492 13.2214 3.22222V5.44444H6.55469V3.22222Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

const UsuarioCardSkeleton = () => {
  
  return (
    <div style={{aspectRatio:"1/0.52"}} className='box-border border border-beef/10 rounded-md p-4 flex gap-2 justify-between bg-cream-dark relative min-h-40 font-flameSans'>
      <div className='w-[80%]'>
        <div className='line-clamp-1'>
          <span className=' box-border text-bold text-xl mb-2 block capitalize font-flame bg-beef rounded-2xl animate-pulse w-[60%]'>
            <span className='opacity-0'>Pepe</span>
          </span>
        </div>
        <div className='line-clamp-1 rounded-3xl bg-beef animate-pulse text-sm w-[90%]'>
          <span className=''>Rol:</span> <span className={`bg-beef rounded-full `}>Administrador</span>
        </div>
      </div>
      
      <div className='w-14 aspect-square rounded-full h-fit bg-beef text-xl text-cream grid place-items-center capitalize animate-pulse'>
          <span className='opacity-0'>Pe</span>
      </div>

      <div className="absolute z-10 bottom-2 right-2 flex gap-2 justify-end bg-cream box-border rounded-lg p-2 w-fit">
        
        <div  className="group h-10 aspect-square bg-beef animate-pulse rounded-md grid place-items-center group">
          
        </div>
        <div  className="group h-10 aspect-square bg-beef animate-pulse rounded-md grid place-items-center group">
          
        </div>
      </div>
    </div>
  )
}
