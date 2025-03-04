import { useEffect, useState } from 'react';
import axios from 'axios';
import CrearIngredienteModal from './CrearIngredienteModal';
import DashboardIntro from '../DashboardIntro/DashboardIntro';
import DashboardSectionWrapper from '../DashboardSectionWrapper/DashboardSectionWrapper';

const Ingredientes = () => {
  const [ingredientes, setIngredientes] = useState(null);
  const [ingredienteEdit, setIngredienteEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchIngredientes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/server/ingredientes');
      setIngredientes(response.data);
    } catch (error) {
      console.error('Error al cargar los ingredientes:', error);
    }
  };

  useEffect(() => {
    fetchIngredientes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/server/ingredientes/${id}`);
      setIngredientes((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error al eliminar el ingrediente:', error);
    }
  };

  const handleEdit = (ingrediente) => {
    setIngredienteEdit(ingrediente);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIngredienteEdit(null);
    fetchIngredientes(); // Recargar lista después de crear/editar
  };

  const vector = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none"><path className="fill-cream" d="M17.5579 3.60039L17.1165 3.78565C16.4395 4.069 16.039 4.43816 15.6943 4.81142C16.0104 4.95854 16.3141 5.14653 16.6029 5.37129C17.2473 5.89576 17.6818 6.46245 18.0224 7.2144L18.5346 8.33825L17.3086 8.18704C16.4299 8.08078 15.8414 8.27695 15.2707 8.4663C15.0377 8.54531 14.7993 8.62432 14.55 8.67881C14.5664 8.78234 14.5787 8.88723 14.5868 8.99076C14.6413 9.61194 14.5582 10.2427 14.343 10.8652C14.0556 11.6458 13.6632 12.2397 13.0625 12.8064L12.6579 13.1864L12.1988 12.8759C11.5163 12.4113 11.0328 11.8869 10.6309 11.1744C10.3625 10.6731 10.1895 10.1609 10.116 9.6351C9.83535 9.68414 9.55745 9.69367 9.285 9.70457C8.68562 9.72773 8.06444 9.75089 7.28115 10.1623L6.18728 10.7385L6.26765 9.50568C6.32078 8.68289 6.52647 8.00041 6.93787 7.29205C7.18716 6.88065 7.48004 6.52375 7.81787 6.22405C7.74023 6.15594 7.66394 6.08511 7.58902 6.01563C7.14765 5.60832 6.6913 5.18603 5.84536 4.92312L4.6643 4.55532L5.38764 3.91915C1.30366 5.14925 0 8.74147 0 12.7737C0 18.4215 5.24733 23 11.7207 23C18.1927 23 23.4414 18.4215 23.4414 12.7737C23.4414 8.61069 21.9388 4.65612 17.5579 3.60039Z" fill="white"></path><path className="fill-cream" d="M8.62705 6.44474C8.19795 6.74307 7.83015 7.13267 7.53454 7.62171C7.24438 8.12029 7.01008 8.69788 6.95695 9.53157C8.69108 8.62023 9.77133 9.32178 10.7835 8.62704C10.7617 8.845 10.7562 9.06023 10.7753 9.27683C10.8121 9.79857 10.9619 10.3121 11.233 10.8162C11.5164 11.3188 11.8937 11.8133 12.5871 12.2833C13.1946 11.7098 13.4889 11.1608 13.6891 10.6186C13.8771 10.0792 13.9439 9.54928 13.8962 9.02754C13.8676 8.68834 13.7899 8.35323 13.6687 8.02221C14.7653 8.18023 15.5445 7.25527 17.3917 7.48276C17.0457 6.72127 16.622 6.26356 16.1752 5.89985C15.7257 5.54703 15.2448 5.31408 14.7367 5.1874C14.6318 5.16015 14.5283 5.14108 14.4206 5.12473C15.0609 4.58801 15.4723 3.70665 16.8495 3.13178C16.1698 2.64274 15.5745 2.45475 15.0064 2.36212C14.4397 2.27902 13.9071 2.31444 13.4031 2.45747C12.899 2.59642 12.4222 2.84026 11.9782 3.20126C11.8079 3.34565 11.643 3.51185 11.4837 3.69439C10.872 1.71778 10.15 0.14031 10.0846 0L9.61195 0.21932C9.62694 0.253376 10.3816 1.89623 11.0055 3.93005C10.9728 3.90008 10.9374 3.87148 10.902 3.84696C10.4266 3.52955 9.92935 3.33203 9.41306 3.24212C8.8995 3.14949 8.36278 3.16448 7.80835 3.3007C7.25119 3.44918 6.67769 3.69166 6.04834 4.24337C7.71708 4.76238 8.11213 5.81947 9.03164 6.2009C8.89269 6.27582 8.75647 6.35483 8.62705 6.44474ZM12.0953 5.43805C12.1021 5.43805 12.1089 5.44213 12.1144 5.4435C12.0899 5.45439 12.064 5.46802 12.0395 5.48028C12.0572 5.46665 12.0762 5.45303 12.0953 5.43805Z" fill="white"></path></svg>

  if (ingredientes === null) {
    return (
      <>
      <DashboardIntro bgColor='rgb(255, 204, 63)' title={"Ingredientes"} vector={vector} />
        <DashboardSectionWrapper >
                    
          <div className="ml-[0px] max-h-screen ">
          

            {/* Botón para crear nuevo ingrediente */}
            <div className='flex justify-between items-center mb-6'>
            <div className="px-8 py-4 bg-beef animate-pulse font-flame text-xl text-cream rounded-3xl"><span className="opacity-0">Agregar Producto</span></div>
            </div>
          

            {/* Contenedor grid */}
            <div className="grid grid-cols-4 gap-5">
              {[...Array(20).fill(null)].map((_,index) => (
                <IngredienteCardSkeleton key={index} />
              ))}
            </div>
            </div>
        </DashboardSectionWrapper>
        </>
    )
  } else
    return (
    
      <>
        <DashboardIntro bgColor='rgb(255, 204, 63)' title={"Ingredientes"} vector={vector} />
        <DashboardSectionWrapper >
                    
          <div className="ml-[0px] max-h-screen ">
          

            {/* Botón para crear nuevo ingrediente */}
            <div className='flex justify-between items-center mb-6'>
              <button
                style={{ backgroundColor: "rgb(255, 204, 63)" }}
                onClick={() => setShowModal(true)}
                className="px-8 py-4 font-flame text-xl text-cream rounded-3xl"
              >
                Crear Nuevo Ingrediente
              </button>
            </div>
          

            {/* Contenedor grid */}
            <div className="grid grid-cols-4 gap-5">
              {ingredientes.map((ingrediente, index) => (
              
                <IngredienteCard key={ingrediente.id} ingrediente={ingrediente} onEdit={() => handleEdit(ingrediente)} onDelete={() => handleDelete(ingrediente.id)} />
             
              ))}
            </div>

            {/* Modal para crear/editar ingrediente */}
            {showModal && (
              <CrearIngredienteModal
                handleCloseModal={handleCloseModal}
                ingredienteEdit={ingredienteEdit}
              />
            )}
          </div>
        </DashboardSectionWrapper>
      </>
    );
}


const IngredienteCard = ({ ingrediente, onEdit, onDelete }) => {
  return (
    <div className='text-beef w-full bg-cream-dark border border-beef/10 box-border rounded-md p-2 flex flex-col gap-2 p-4'>
      <h2 className=' font-flame text-beef text-3xl capitalize mb-2'>{ingrediente.nombre}</h2>
      <div className='flex gap-2 my-2'>
        <div className='rounded-md bg-cream flex flex-col gap-1 justify-center items-center text-md w-full min-h-16 p-2 py-3 box-border font-flameSans'>
          <span className='font-bold text-lg'>Cantidad</span>
          <span className='capitalize'>{ingrediente.cantidad}</span>
        </div>
        <div className='rounded-md bg-cream flex flex-col gap-1 justify-center items-center text-md w-full min-h-16 p-2 py-3 box-border font-flameSans'>
          <span className='font-bold capitalize text-lg'>Tipo</span>
          <span className='capitalize'>{ingrediente.type}</span>
        </div>
      </div>
      <div className='flex gap-2 w-full box-border justify-end'>
          <button onClick={onEdit} className="group h-10 aspect-square bg-cheddar rounded-md flex justify-center items-center"><svg className="group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"><path className="stroke-cream" d="M20.197 5.46736L10.6982 14.9661C9.75225 15.912 6.94439 16.3502 6.31711 15.7229C5.68982 15.0956 6.11797 12.2878 7.06387 11.3419L16.5727 1.83308C16.8072 1.57725 17.091 1.3716 17.4073 1.22852C17.7234 1.08544 18.0653 1.00788 18.4123 1.00057C18.7592 0.99327 19.1041 1.05634 19.426 1.18598C19.7479 1.31563 20.0403 1.50919 20.2853 1.75493C20.5303 2.00066 20.7231 2.2935 20.8519 2.61576C20.9806 2.93803 21.0428 3.28304 21.0346 3.62998C21.0263 3.97693 20.9477 4.31864 20.8039 4.63442C20.6599 4.9502 20.4535 5.23356 20.197 5.46736Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path className="stroke-cream" d="M9.96117 3.07764H4.98274C3.92645 3.07764 2.91349 3.49724 2.16657 4.24415C1.41967 4.99106 1 6.00409 1 7.06038V17.0172C1 18.0736 1.41967 19.0866 2.16657 19.8334C2.91349 20.5804 3.92645 21 4.98274 21H15.9353C18.1357 21 18.9223 19.2077 18.9223 17.0172V12.0388" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg><div></div></button>
          <button onClick={onDelete} className="group h-10 aspect-square bg-beef rounded-md grid place-items-center group"><svg className="group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none"><path className="stroke-cream" d="M7.66602 9.88867V16.5553" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path className="stroke-cream" d="M12.1113 9.88867V16.5553" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path className="stroke-cream" d="M1 5.44434H18.7778" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path className="stroke-cream" d="M3.22266 5.44434H9.88932H16.556V17.6666C16.556 19.5076 15.0637 20.9999 13.2227 20.9999H6.55599C4.71504 20.9999 3.22266 19.5076 3.22266 17.6666V5.44434Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path className="stroke-cream" d="M6.55469 3.22222C6.55469 1.99492 7.54961 1 8.77691 1H10.9991C12.2265 1 13.2214 1.99492 13.2214 3.22222V5.44444H6.55469V3.22222Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg></button>
        </div>
    </div>
  )
}

const IngredienteCardSkeleton = () => {
  return (
    <div className='text-beef w-full bg-cream-dark border border-beef/10 box-border rounded-md p-2 flex flex-col gap-2 p-4'>
      <h2 className=' font-flame text-beef text-3xl capitalize mb-2 opacity-0 animate-pulse bg-beef w-[70%] h-8 rounded-2xl'></h2>
      <div className='flex gap-2 my-2'>
        <div className='rounded-md bg-beef animate-pulse flex flex-col gap-1 justify-center items-center text-md w-full min-h-16 p-2 py-3 box-border font-flameSans'>
          <span className='font-bold text-lg opacity-0'>Cantidad</span>
          <span className='capitalize opacity-0'>0</span>
        </div>
        <div className='rounded-md bg-beef animate-pulse flex flex-col gap-1 justify-center items-center text-md w-full min-h-16 p-2 py-3 box-border font-flameSans'>
          <span className='font-bold capitalize text-lg opacity-0'>Tipo</span>
          <span className='capitalize opacity-0'>queso</span>
        </div>
      </div>
      <div className='flex gap-2 w-full box-border justify-end'>
          <div className="group h-10 aspect-square bg-beef animate-pulse rounded-md flex justify-center items-center"><div></div></div>
          <div className="group h-10 aspect-square bg-beef animate-pulse rounded-md grid place-items-center group"></div>
        </div>
    </div>
  )
}

export default Ingredientes;
