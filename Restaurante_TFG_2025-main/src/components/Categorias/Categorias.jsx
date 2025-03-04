import { useEffect, useState } from 'react';
import { fetchCategorias, deleteCategoria } from '../../connections';
import CrearCategoriaModal from '../CrearCategoriaModal/CrearCategoriaModal';
import ImagenCategorias from './imagenCategorias';
import DefaultCategoryImg from './default.jpg'
import DashboardIntro from '../DashboardIntro/DashboardIntro';
import DashboardSectionWrapper from '../DashboardSectionWrapper/DashboardSectionWrapper';

const Categorias = () => {
  const [categorias, setCategorias] = useState(null);
  const [categoriaEdit, setCategoriaEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showActive, setShowActive] = useState(false);

  const fetchCategoriasData = async () => {
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar las categorías:', error);
    }
  };

  useEffect(() => {
    fetchCategoriasData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCategoria(id);
      setCategorias((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
    }
  };

  const handleEdit = (categoria) => {
    setCategoriaEdit(categoria);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoriaEdit(null);
    fetchCategoriasData(); // Recargar cambios
  };

  const handleCheckboxChange = () => {
    setShowActive(!showActive);
    };
    
    const vector = <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
    <path className="fill-cream" d="M6.68878 0.48003C5.91327 0.28811 4.94388 0.0961914 4.16838 0.0961914C3.39286 0.0961914 2.42347 0.28811 1.64796 0.48003C0.96939 0.575989 0.48469 1.15175 0.387752 1.82346C0.290814 2.59114 0 4.12649 0 5.18205C0 6.2376 0.193876 7.58105 0.290814 8.54063C0.387752 9.21238 0.872452 9.78808 1.55102 9.88403C2.22959 10.076 3.29592 10.172 4.07143 10.172C4.84694 10.172 5.81633 9.98007 6.59185 9.88403C7.27041 9.78808 7.75514 9.21238 7.85204 8.54063C8.04594 7.58105 8.14284 6.2376 8.14284 5.18205C8.14284 4.12649 7.94894 2.59114 7.85204 1.82346C7.85204 1.15175 7.36735 0.575989 6.68878 0.48003Z" fill="white"></path>
    <path className="fill-cream" d="M17.3516 9.11598C16.673 8.92408 15.6068 8.82812 14.8313 8.82812C14.0557 8.82812 13.0863 9.02003 12.3108 9.11598C11.6322 9.21193 11.1476 9.78772 11.0507 10.4595C10.8568 11.4191 10.7598 12.7625 10.7598 13.818C10.7598 14.8735 10.9537 16.217 11.0507 17.1766C11.1476 17.8483 11.6322 18.4241 12.3108 18.52C12.9894 18.7119 14.0557 18.8079 14.8313 18.8079C15.6068 18.8079 16.5761 18.616 17.3516 18.52C18.0302 18.4241 18.5149 17.8483 18.6118 17.1766C18.8057 16.217 18.9027 14.8735 18.9027 13.818C18.9027 12.7625 18.8057 11.4191 18.6118 10.4595C18.5149 9.78772 18.0302 9.21193 17.3516 9.11598Z" fill="white"></path>
    <path className="fill-cream" d="M6.78572 12.9544C6.01021 12.7625 5.04082 12.6665 4.16837 12.6665C3.29592 12.6665 2.32653 12.8584 1.55102 12.9544C0.96939 13.0503 0.48469 13.5301 0.290814 14.1059C0.096938 14.7776 0 15.3534 0 15.8331C0 16.313 0.096938 16.7927 0.290814 17.5604C0.48469 18.1362 0.96939 18.52 1.55102 18.7119C2.32653 18.9039 3.29592 18.9999 4.16837 18.9999C5.04082 18.9999 6.01021 18.8079 6.78572 18.7119C7.36735 18.616 7.85204 18.1362 8.04594 17.5604C8.23983 16.8887 8.33673 16.313 8.33673 15.8331C8.33673 15.3534 8.23983 14.8735 8.04594 14.1059C7.85204 13.4342 7.36735 13.0503 6.78572 12.9544Z" fill="white"></path>
    <path className="fill-cream" d="M12.215 6.04545C12.9906 6.23738 13.96 6.33334 14.8324 6.33334C15.7049 6.33334 16.6742 6.14142 17.4497 6.04545C18.0314 5.94949 18.5161 5.4697 18.71 4.89394C18.9039 4.22222 19.0008 3.64646 19.0008 3.16667C19.0008 2.68687 18.9039 2.20707 18.71 1.43939C18.5161 0.863636 18.0314 0.479798 17.4497 0.287879C16.6742 0.0959595 15.7049 0 14.8324 0C13.96 0 12.9906 0.191919 12.215 0.287879C11.6334 0.383838 11.1488 0.863636 10.9549 1.43939C10.761 2.11111 10.6641 2.68687 10.6641 3.16667C10.6641 3.64646 10.761 4.12626 10.9549 4.89394C11.1488 5.56565 11.6334 5.94949 12.215 6.04545Z" fill="white"></path>
    </svg>

  const filteredCategorias = showActive && categorias !==null
    ? categorias.filter((categoria) => categoria.isActive)
        : categorias;
    
    if (filteredCategorias === null) {
        return (
            
            <>
            <DashboardIntro title={"Categorías"} vector={vector} />
                <DashboardSectionWrapper>
                        <div className='flex justify-between items-center mb-6'>
                            <div className='px-8 py-4 animate-pulse bg-beef box-border h-14 w-56 rounded-xl' />
                            <div className='h-8 w-28 bg-beef animate-pulse rounded-xl' />
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
                            {[...Array(12).fill(null)].map((elem, index) => (
                                <CategorySkeleton key={index} />
                            ))}
                        </div>
                    
                
            </DashboardSectionWrapper>
            </>
        )
    } else {
        return (
            <>
            <DashboardIntro title={"Categorías"} vector={vector} />
            <DashboardSectionWrapper>
                
            <div className="ml-[0px] max-h-screen">
                <div className='flex justify-between items-center mb-6'>
                    {/* Botón para crear nueva categoría */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-8 py-4 bg-ketchup font-flame text-xl text-cream rounded-3xl"
                    >
                        Crear Nueva Categoría
                            </button>    

                    {/* Checkbox para filtrar 'Activos' */}
                <label className="font-flameSans text-beef-light flex items-center gap-2 text-xl relative">
                    <div className='h-full w-5 grid place-items-center absolute left-0 top-0'>
                                    <div className={`${showActive ? "opacity-0" : "opacity-100"} w-full aspect-square box-border border border-beef/40 rounded-sm`}></div>
                    </div>
                    <input
                        type="checkbox"
                        checked={showActive}
                        onChange={handleCheckboxChange}
                        className={`${showActive ? "opacity-100" : "opacity-0"} accent-beef w-5 aspect-square bg-transparent border-beef/10`}
                    />
                                <span className='block mb-[1px]'>
                                    Activos
                                </span>
                </label>        
                </div>
              
        
              
                  
        
              {/* Modal para crear/editar categoría */}
              {showModal && (
                <CrearCategoriaModal
                  handleCloseModal={handleCloseModal}
                  categoriaEdit={categoriaEdit}
                />
                  )}
                  
                  <div className='grid grid-cols-4 gap-5'>
                      {filteredCategorias.map(categoria => (
                          <Category
                              key={categoria.id}
                              categoria={categoria}
                              handleDelete={() => handleDelete(categoria.id)}
                              handleEdit={() => handleEdit(categoria)}
                          />
                      ))}
        
                    </div>
            </div>
            </DashboardSectionWrapper>
            </>
          );
    }

    
  
};


const Category = ({ categoria, handleDelete, handleEdit }) => {
    return (
        <div style={{aspectRatio:"1/0.8"}} className='text-beef w-full bg-cream-dark border border-beef/10 box-border rounded-md p-2 flex flex-col gap-2'>
            <div className='relative w-full grow shrink h-[80%] rounded-md overflow-hidden'>
                {!categoria.img ? 
                    /* Si no tiene imagen sale la de por defecto y si SI tiene imagen pues sale la que devuelve el componente de ImagenCategorias */
                    <img className='absolute w-full h-full z-0 object-cover object-center' src={DefaultCategoryImg} alt='Categoría por defecto.'/>
                        :
                    <ImagenCategorias imagenKey={categoria.imagen} />
                }
                <div className='absolute z-10 top-0 right-0 flex gap-2 w-full p-2 box-border justify-end'>
                    <div className={`${categoria.isActive ? "bg-lettuce" : "bg-ketchup"} mr-auto  h-10 aspect-square rounded-full grid place-items-center group`}>
                        {categoria.isActive ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 14 10" fill="none">
                                <path className='fill-cream' d="M0.449219 5.00023C0.449219 4.568 0.606934 4.20227 0.922363 3.90304C1.23779 3.60381 1.60303 3.45419 2.01807 3.45419C2.4331 3.45419 2.79834 3.60381 3.11377 3.90304L5.33007 6.09741L10.8335 0.61148C11.1323 0.295623 11.4975 0.137695 11.9292 0.137695C12.3608 0.137695 12.7261 0.295623 13.0249 0.61148C13.3237 0.927337 13.4814 1.29307 13.498 1.70867C13.5146 2.12427 13.3569 2.49 13.0249 2.80585L6.42578 9.41391C6.12695 9.72977 5.76171 9.88769 5.33007 9.88769C4.89843 9.88769 4.5332 9.72977 4.23437 9.41391L0.922363 6.09741C0.606934 5.79818 0.449219 5.43245 0.449219 5.00023Z" fill="black"/>
                            </svg>
                            : 
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                <path className='stroke-cream' d="M3.25 3.25L9.74983 9.74989M9.74983 9.74989L16.2499 16.25M9.74983 9.74989L3.25 16.25M9.74983 9.74989L16.2499 3.25" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        }
                    </div>
                    <button onClick={handleEdit} className='group h-10 aspect-square bg-cheddar rounded-md grid place-items-center group'>
                        <svg  className='group-hover:scale-110' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <path className='stroke-cream' d="M20.197 5.46736L10.6982 14.9661C9.75225 15.912 6.94439 16.3502 6.31711 15.7229C5.68982 15.0956 6.11797 12.2878 7.06387 11.3419L16.5727 1.83308C16.8072 1.57725 17.091 1.3716 17.4073 1.22852C17.7234 1.08544 18.0653 1.00788 18.4123 1.00057C18.7592 0.99327 19.1041 1.05634 19.426 1.18598C19.7479 1.31563 20.0403 1.50919 20.2853 1.75493C20.5303 2.00066 20.7231 2.2935 20.8519 2.61576C20.9806 2.93803 21.0428 3.28304 21.0346 3.62998C21.0263 3.97693 20.9477 4.31864 20.8039 4.63442C20.6599 4.9502 20.4535 5.23356 20.197 5.46736Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path className='stroke-cream' d="M9.96117 3.07764H4.98274C3.92645 3.07764 2.91349 3.49724 2.16657 4.24415C1.41967 4.99106 1 6.00409 1 7.06038V17.0172C1 18.0736 1.41967 19.0866 2.16657 19.8334C2.91349 20.5804 3.92645 21 4.98274 21H15.9353C18.1357 21 18.9223 19.2077 18.9223 17.0172V12.0388" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button onClick={handleDelete} className='group h-10 aspect-square bg-beef rounded-md grid place-items-center group'>
                        <svg  className='group-hover:scale-110' xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
                            <path className='stroke-cream' d="M7.66602 9.88867V16.5553" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path className='stroke-cream' d="M12.1113 9.88867V16.5553" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path className='stroke-cream' d="M1 5.44434H18.7778" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path className='stroke-cream' d="M3.22266 5.44434H9.88932H16.556V17.6666C16.556 19.5076 15.0637 20.9999 13.2227 20.9999H6.55599C4.71504 20.9999 3.22266 19.5076 3.22266 17.6666V5.44434Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path className='stroke-cream' d="M6.55469 3.22222C6.55469 1.99492 7.54961 1 8.77691 1H10.9991C12.2265 1 13.2214 1.99492 13.2214 3.22222V5.44444H6.55469V3.22222Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className='grow shrink flex flex-col justify-between px-1'>
                <h2 className='font-flame text-2xl capitalize line-clamp-1'>{categoria.nombre}</h2>
                <p className='font-flameSans line-clamp-1 bg-cream p-1 px-2 rounded-md mt-1 mb-1'>{categoria.descripcion}</p>
            </div>
        </div>
    )
}

const CategorySkeleton = () => {

    return (
        <div style={{aspectRatio:"1/0.8"}} className='text-beef w-full bg-cream-dark border border-beef/10 box-border rounded-md p-2 flex flex-col gap-2'>
            <div className='relative w-full grow shrink h-[80%] rounded-md overflow-hidden'>
                <div className='absolute h-full w-full animate-pulse bg-beef' />
                <div className='absolute z-10 top-2 right-2 flex gap-2'>
                    {[...Array(3).fill(null)].map((elem, index) => (
                       <div key={index} className={`animate-pulse bg-beef-light h-10 aspect-square rounded-md grid place-items-center group`} /> 
                    ))}
                    
                    
                    
                </div>
            </div>
            <div className='grow shrink flex flex-col justify-between px-1 gap-2'>
                <h2 className='rounded-xl font-flame text-2xl capitalize line-clamp-1 animate-pulse bg-beef w-[80%] h-6' />
                <p className='rounded-xl font-flameSans line-clamp-1 animate-pulse bg-beef h-4 w-[90%]' />
            </div>
        </div>
    )
}
export default Categorias;
