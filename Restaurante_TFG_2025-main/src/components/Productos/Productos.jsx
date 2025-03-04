import { useState, useEffect } from 'react';
import { fetchProductos, deleteProducto,fetchCategorias } from '../../connections';
import CrearProductoModal from './CrearProductoModal';
import Producto from './Producto';
import DashboardIntro from '../DashboardIntro/DashboardIntro';
import DashboardSectionWrapper from '../DashboardSectionWrapper/DashboardSectionWrapper';
import ImagenProductos from './imagen';
import LogoStroke from '../LogoStroke/LogoStroke';


const ListaProductos = () => {
    const [showModal, setShowModal] = useState(false);
    const [categorias, setCategorias] = useState(null);
  const [productos, setProductos] = useState(null);
  const [productoEdit, setProductoEdit] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
      fetchProductosData();
      fetchCategoriasData();
  }, []);

  const fetchProductosData = async () => {
    try {
      const data = await fetchProductos();
      setProductos(data);
      console.log('Lista de productos:', data);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
    };
    
    const fetchCategoriasData = async () => {
        try {
          const data = await fetchCategorias();
          setCategorias(data);
        } catch (error) {
          console.error('Error al cargar las categorías:', error);
        }
      };

  const handleAgregarProductoClick = () => {
    setProductoEdit(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchProductosData();
  };

  const handleDelete = async (id) => {
    try {
      await deleteProducto(id);
      fetchProductosData();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const handleEdit = (producto) => {
    setProductoEdit(producto);
    setShowModal(true);
  };

  const handleCategoriaChange = (e) => {
    setSelectedCategoria(e.target.value);
  };

  const handleCheckboxChangeStatus = () => {
    setIsActive(!isActive);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtros
  let filteredProductos = selectedCategoria
    ? productos.filter((producto) =>
        producto.categorias.some((cat) => cat.nombre === selectedCategoria)
      )
    : productos;

  if (isActive) {
    filteredProductos = filteredProductos.filter((producto) => producto.isActive);
  }

  if (searchTerm) {
    filteredProductos = filteredProductos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    }
    
    const vector = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path className="fill-cream" d="M8.00032 10.0624C8.86734 10.0624 9.72056 10.1589 10.5619 10.351C11.4023 10.5441 12.1777 10.8506 12.8871 11.2713C13.5965 11.691 14.2044 12.2299 14.7128 12.887C15.2212 13.5432 15.5709 14.3275 15.764 15.2379C15.8163 15.4832 15.764 15.7019 15.6084 15.895C15.4517 16.0881 15.2497 16.1837 15.0015 16.1837H0.971519C0.724221 16.1837 0.522257 16.0881 0.365601 15.895C0.208947 15.7019 0.157713 15.4832 0.209931 15.2379C0.403039 14.3275 0.752792 13.5432 1.2612 12.887C1.7686 12.2299 2.37749 11.691 3.08687 11.2713C3.79625 10.8505 4.57557 10.5441 5.42486 10.351C6.27513 10.1589 7.13327 10.0624 8.00032 10.0624ZM0.892646 19.6519C0.652246 19.6519 0.443384 19.5633 0.266021 19.3849C0.0886769 19.2066 0 18.9967 0 18.7544C0 18.512 0.0886718 18.3031 0.266021 18.1287C0.443364 17.9533 0.652226 17.8656 0.892646 17.8656H15.0802C15.3216 17.8656 15.5305 17.9553 15.7079 18.1327C15.8852 18.311 15.9739 18.5218 15.9739 18.7632C15.9739 19.0056 15.8852 19.2145 15.7079 19.3898C15.5305 19.5642 15.3216 19.6519 15.0802 19.6519H0.892646ZM0.892646 23.12C0.652246 23.12 0.443384 23.0313 0.266021 22.853C0.0886769 22.6747 0 22.4648 0 22.2224C0 21.9801 0.0886718 21.7712 0.266021 21.5968C0.443364 21.4214 0.652226 21.3337 0.892646 21.3337H15.0802C15.3216 21.3337 15.5305 21.4234 15.7079 21.6007C15.8852 21.7791 15.9739 21.9899 15.9739 22.2313C15.9739 22.4737 15.8852 22.6825 15.7079 22.8579C15.5305 23.0323 15.3216 23.12 15.0802 23.12H0.892646ZM20.4665 23.12H18.3383C18.1147 23.12 17.9275 23.0451 17.7767 22.8934C17.626 22.7427 17.5501 22.5555 17.5501 22.3318V15.895C17.5501 14.1373 16.9856 12.6023 15.8555 11.2919C14.7254 9.98165 13.3116 9.09879 11.6121 8.6436C11.4722 8.60813 11.35 8.53424 11.2446 8.41995C11.1392 8.30664 11.0781 8.17955 11.0603 8.03964L10.7717 5.59622C10.7362 5.3509 10.7993 5.14497 10.9589 4.97848C11.1195 4.81197 11.3195 4.72921 11.5599 4.72921H16.0525V0.78821C16.0525 0.564558 16.1283 0.377362 16.2801 0.226608C16.4328 0.0748802 16.621 0 16.8456 0C17.0702 0 17.2565 0.0748802 17.4052 0.226608C17.554 0.377352 17.6289 0.564538 17.6289 0.78821V4.72921H22.2527C22.498 4.72921 22.695 4.81394 22.8438 4.98537C22.9926 5.15582 23.0497 5.35977 23.0153 5.59623L21.2546 22.4105C21.227 22.6075 21.1364 22.775 20.9847 22.913C20.8319 23.0509 20.6596 23.12 20.4665 23.12Z" fill="white"></path></svg>

    const skeleton = <div>
                <DashboardIntro bgColor='#4BA864' title={"Productos"} vector={vector} />
                <DashboardSectionWrapper>
                    <div className="flex h-screen text-beef">
                        <div className="w-full ">
                            
                        <div className="grid grid-cols-3 gap-5 w-full">
    <div style={{ gridColumn: "1/-1" }} className='mb- flex justify-between items-center'>
        <div className="px-8 py-4 bg-beef animate-pulse font-flame text-xl text-cream rounded-3xl"><span className='opacity-0'>Agregar Producto</span></div>
        <div className='flex gap-4 h-10 w-2/5'>
            <div className='h-full w-[60%] bg-beef animate-pulse rounded-md'></div>
            <div className='h-full w-[40%] bg-beef animate-pulse rounded-md'></div>
        </div>
    </div>
    {
        [...Array(9).fill(null)].map((elem,index) => (
            <ProductCardSkeleton key={index} />
        ))
    }
</div> 

                            
                        </div>
                    </div>
                </DashboardSectionWrapper>
            </div>
    
    
        
    
    if (productos === null || categorias === null) {
            return skeleton
    } else {
        return (
            <>
                <DashboardIntro bgColor='#4BA864' title={"Productos"} vector={vector} />
                <DashboardSectionWrapper>
                    <div className="flex h-screen text-beef">
                        <div className="w-full ">
                            
                            <div className='w-full flex justify-between items-center mb-6'>

                                {/* Botón Agregar Producto */}
                                <button
                                    onClick={handleAgregarProductoClick}
                                    className="px-8 py-4 bg-lettuce font-flame text-xl text-cream rounded-3xl"
                                >
                                    Agregar Producto
                                </button>

                                
                                <div className='flex gap-4'>
                                    {/* Input de búsqueda */}
                                    <div className='relative'>
                                        <input
                                            type="text"
                                            placeholder="Buscar un producto"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="box-border pr-8 text-md p-2 rounded border placeholder-beef/80 focus:outline-none focus:border-beef/80 border-beef/10 w-full  bg-cream-dark font-flameSans text-beef"
                                        />
                                        <div className='absolute h-full w-8 grid place-items-center top-0 right-0'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="19px" height="19px" viewBox="0 0 24 24" fill="none">
                                                <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        
                                    </div>
                                

                                {/* Select de Categorías */}
                                <select
                                    onChange={handleCategoriaChange}
                                    value={selectedCategoria}
                                    className="text-md p-2 rounded border border-beef/10 bg-cream-dark font-flameSans"
                                >
                                    <option value="">Todas las Categorías</option>
                                    {categorias.map((categoria, index) => (
                                        <option className='hover:bg-red-700' key={index} value={categoria.nombre}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                    </select>
                                    
                                    <fiv></fiv>
                                </div>

                            </div>

                            {/* Modal para crear/editar producto */}
                            {showModal && (
                                <CrearProductoModal
                                    handleCloseModal={handleCloseModal}
                                    categorias={categorias}
                                    productoEdit={productoEdit}
                                />
                            )}

                            {/* Contenedor de productos */}
                            <div className="grid grid-cols-3 gap-5 w-full">
                                {
                                    filteredProductos.length > 0 ? filteredProductos.map((producto) => (
                                        <ProductCard
                                                key={producto.id}
                                                producto={producto}
                                                handleDelete={handleDelete}
                                                handleEdit={handleEdit}
                                            />
                                    )) :
                                    <h3 className='font-flameSans text-xl py-8'>No se han encontrado productos con ese término de búsqueda.</h3>
                                }

                                
                            </div>

                            
                        </div>
                    </div>
                </DashboardSectionWrapper>
            </>
        )
        }
        
    
};

const ProductCard = ({ producto, handleDelete, handleEdit }) => {
    
    let categorias = [];
  let ingredientesOriginales = [];

  try {
        if (producto.categorias) {
        categorias = producto.categorias.map((categoria) => categoria.nombre);
        console.log('ok', producto.categorias);
        } else {
        console.log('err', producto.categorias);
        }

        if (producto.ingredientesOriginales) {
        ingredientesOriginales =
            typeof producto.ingredientesOriginales === 'string'
            ? JSON.parse(producto.ingredientesOriginales)
            : producto.ingredientesOriginales;
        console.log('ok', ingredientesOriginales);
        } else {
        console.log('err', producto.ingredientesOriginales);
        }
    } catch (error) {
        console.log('err', producto.categorias);
        console.error('Error al manejar las categorías o ingredientes:', error);
    }
    
    return (
        <div className='box-border p-2 border border-beef/10 bg-cream-dark rounded-md flex flex-col gap-2'>
            <div style={{aspectRatio:"1/0.5"}} className='relative w-full rounded-md overflow-hidden grow shrink'>
                <ImagenProductos alt={producto.nombre} imagenKey={producto.imagen} />
                <div className='absolute z-10 top-0 right-0 flex gap-2 w-full p-2 box-border justify-end'>
                    <div className={`${producto.isActive ? "bg-lettuce" : "bg-ketchup" } mr-auto  h-10 aspect-square rounded-full grid place-items-center group`}>
                    {producto.isActive ? 
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
                        <svg className="group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"><path className="stroke-cream" d="M20.197 5.46736L10.6982 14.9661C9.75225 15.912 6.94439 16.3502 6.31711 15.7229C5.68982 15.0956 6.11797 12.2878 7.06387 11.3419L16.5727 1.83308C16.8072 1.57725 17.091 1.3716 17.4073 1.22852C17.7234 1.08544 18.0653 1.00788 18.4123 1.00057C18.7592 0.99327 19.1041 1.05634 19.426 1.18598C19.7479 1.31563 20.0403 1.50919 20.2853 1.75493C20.5303 2.00066 20.7231 2.2935 20.8519 2.61576C20.9806 2.93803 21.0428 3.28304 21.0346 3.62998C21.0263 3.97693 20.9477 4.31864 20.8039 4.63442C20.6599 4.9502 20.4535 5.23356 20.197 5.46736Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path className="stroke-cream" d="M9.96117 3.07764H4.98274C3.92645 3.07764 2.91349 3.49724 2.16657 4.24415C1.41967 4.99106 1 6.00409 1 7.06038V17.0172C1 18.0736 1.41967 19.0866 2.16657 19.8334C2.91349 20.5804 3.92645 21 4.98274 21H15.9353C18.1357 21 18.9223 19.2077 18.9223 17.0172V12.0388" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </button>
                    <button onClick={handleDelete} className="group h-10 aspect-square bg-beef rounded-md grid place-items-center group"><svg className="group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none"><path className="stroke-cream" d="M7.66602 9.88867V16.5553" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path className="stroke-cream" d="M12.1113 9.88867V16.5553" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path className="stroke-cream" d="M1 5.44434H18.7778" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path className="stroke-cream" d="M3.22266 5.44434H9.88932H16.556V17.6666C16.556 19.5076 15.0637 20.9999 13.2227 20.9999H6.55599C4.71504 20.9999 3.22266 19.5076 3.22266 17.6666V5.44434Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path className="stroke-cream" d="M6.55469 3.22222C6.55469 1.99492 7.54961 1 8.77691 1H10.9991C12.2265 1 13.2214 1.99492 13.2214 3.22222V5.44444H6.55469V3.22222Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </button>
                </div>
                <div className='absolute h-fit px-3 py-[1px] rounded-md bg-cream/60 bottom-2 right-2 text-xl'>
                    {producto.precio} €
                </div>
            </div>
            <div className='grow shrink flex flex-col gap-1 box-border px-1'>
                <h2 className='font-flame text-2xl'>{producto.nombre}</h2>
                <p className='font-flameSans bg-cream p-1 px-2 rounded-md my-2'>{producto.descripcion}</p>
                <div className='flex flex-col gap-3 my-2'>
                <p className='inline-flex flex-wrap gap-1 px-1 box-border' >
                    
                    {
                        ingredientesOriginales.length > 0 ?
                        <>
                            <span className='font-flame'>Ingredientes:</span>    
                                <ul className='p-0 inline-flex flex-wrap gap-1'>{ingredientesOriginales.map(ingrediente => (
                                
                                <li className='bg-cream rounded-2xl px-2 capitalize ' key={ingrediente.nombre}>{ingrediente.nombre}</li>
                                ))}
                            </ul>
                        </>
                            :
                            <span className='font-flame'>Sin categorías.</span> 

                    }
                </p>
                
                <p className='inline-flex flex-wrap gap-1 px-1 box-border ' >
                    
                    {
                        categorias.length > 0 ?
                        <>
                            <span className='font-flame'>Categorias:</span>    
                                <ul className='p-0 inline-flex flex-wrap gap-1'>{categorias.map(categoria => (
                                
                                <li className='bg-cream rounded-2xl px-2 capitalize ' key={categoria}>{categoria}</li>
                                ))}
                            </ul>
                        </>
                            :
                            <span className='font-flame'>Sin categorías.</span> 

                    }
                    
                </p>
                </div>
                

                <p className={`text-md ${producto.personalizable ? "bg-lettuce/30" : "bg-ketchup/30"}  rounded-md box-border px-4 py-1 w-fit ml-auto mt-auto flex gap-1 items-center justify-start`}>
                    {producto.personalizable ?
                        <>
                            <svg className='pt-[2px]' xmlns="http://www.w3.org/2000/svg" width="15" height="10" viewBox="0 0 14 10" fill="none">
                                <path className="fill-beef" d="M0.449219 5.00023C0.449219 4.568 0.606934 4.20227 0.922363 3.90304C1.23779 3.60381 1.60303 3.45419 2.01807 3.45419C2.4331 3.45419 2.79834 3.60381 3.11377 3.90304L5.33007 6.09741L10.8335 0.61148C11.1323 0.295623 11.4975 0.137695 11.9292 0.137695C12.3608 0.137695 12.7261 0.295623 13.0249 0.61148C13.3237 0.927337 13.4814 1.29307 13.498 1.70867C13.5146 2.12427 13.3569 2.49 13.0249 2.80585L6.42578 9.41391C6.12695 9.72977 5.76171 9.88769 5.33007 9.88769C4.89843 9.88769 4.5332 9.72977 4.23437 9.41391L0.922363 6.09741C0.606934 5.79818 0.449219 5.43245 0.449219 5.00023Z" fill="black"></path>
                            </svg>
                        <span>Personalizable</span>
                        </>
                        :
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 19 19" fill="none">
                                <path className="stroke-beef" d="M3.25 3.25L9.74983 9.74989M9.74983 9.74989L16.2499 16.25M9.74983 9.74989L3.25 16.25M9.74983 9.74989L16.2499 3.25" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        <span>No Personalizable</span>
                        </>
                    }
                </p>
            </div>
        </div>
    )
}

const ProductCardSkeleton = () => {
    return (
        <div className='box-border p-2 border border-beef/10 bg-cream-dark rounded-md flex flex-col gap-2'>
            <div style={{aspectRatio:"1/0.5"}} className='relative w-full rounded-md overflow-hidden grow shrink'>
                <div className='absolute w-full h-full z-0 grid place-items-center bg-beef-light animate-pulse'>
                <LogoStroke bunStroke={"rgb(56 9 6 / 1)"} hungryStroke={"rgb(56 9 6 / 1)"} joeStroke={"rgb(56 9 6 / 1)"}/>
                </div>
                <div className='absolute z-10 top-0 right-0 flex gap-2 w-full p-2 box-border justify-end'>
                    <div className={`bg-beef mr-auto animate-pulse  h-10 aspect-square rounded-full grid place-items-center group`}>
                        
                    </div>

                    <div  className='group h-10 aspect-square bg-beef animate-pulse rounded-md grid place-items-center group'>
                        
                    </div>
                    <div  className="group h-10 aspect-square bg-beef animate-pulse rounded-md grid place-items-center group">
                    </div>
                </div>
                <div className='absolute h-fit px-3 py-[1px] rounded-md bg-beef/60 animate-pulse bottom-2 right-2 text-xl'>
                    <span className='opacity-0'>120</span>
                </div>
            </div>
            <div className='grow shrink flex flex-col gap-1 box-border px-1'>
                <h2 className='font-flame text-2xl h-7 w-[80%] bg-beef rounded-3xl animate-pulse'></h2>
                <p className='font-flameSans bg-beef p-1 px-2 rounded-xl animate-pulse mt-2 w-full h-4'></p>
                <p className='font-flameSans bg-beef p-1 px-2 rounded-xl animate-pulse  w-[90%] h-4'></p>
                <div className='flex flex-col gap-3 my-2'>
                <p className='inline-flex flex-wrap gap-1 px-1 box-border px-0' >
                    
                    
                        <span className='font-flame bg-beef animate-pulse rounded-xl'>
                            <span className='opacity-0'>Ingredientes:</span>
                            
                        </span>    
                                <ul className='p-0 inline-flex flex-wrap gap-1'>
                                
                            <li className='bg-beef animate-pulse rounded-2xl px-2 capitalize ' >
                                <span className='opacity-0'>hola</span>
                            </li>

                            <li className='bg-beef animate-pulse rounded-2xl px-2 capitalize ' >
                                <span className='opacity-0'>super tomate</span>
                            </li>
                              
                            </ul>
               
                </p>
                
                <p className='inline-flex flex-wrap gap-1 px-1 box-border px-0' >
                    
                    
                        <span className='font-flame bg-beef animate-pulse rounded-xl'>
                            <span className='opacity-0'>Ingredientes:</span>
                            
                        </span>    
                                <ul className='p-0 inline-flex flex-wrap gap-1'>
                                
                            <li className='bg-beef animate-pulse rounded-2xl px-2 capitalize ' >
                                <span className='opacity-0'>Ingrediente</span>
                            </li>

                            <li className='bg-beef animate-pulse rounded-2xl px-2 capitalize ' >
                                <span className='opacity-0'>super</span>
                            </li>
                              
                            </ul>
               
                </p>
                </div>
                

                <p className={`bg-beef animate-pulse rounded-md box-border px-4 py-1 w-fit ml-auto mt-auto flex gap-1 items-center justify-start`}>
                    
                            <svg className='pt-[2px] opacity-0' xmlns="http://www.w3.org/2000/svg" width="15" height="10" viewBox="0 0 14 10" fill="none">
                                <path className="fill-beef" d="M0.449219 5.00023C0.449219 4.568 0.606934 4.20227 0.922363 3.90304C1.23779 3.60381 1.60303 3.45419 2.01807 3.45419C2.4331 3.45419 2.79834 3.60381 3.11377 3.90304L5.33007 6.09741L10.8335 0.61148C11.1323 0.295623 11.4975 0.137695 11.9292 0.137695C12.3608 0.137695 12.7261 0.295623 13.0249 0.61148C13.3237 0.927337 13.4814 1.29307 13.498 1.70867C13.5146 2.12427 13.3569 2.49 13.0249 2.80585L6.42578 9.41391C6.12695 9.72977 5.76171 9.88769 5.33007 9.88769C4.89843 9.88769 4.5332 9.72977 4.23437 9.41391L0.922363 6.09741C0.606934 5.79818 0.449219 5.43245 0.449219 5.00023Z" fill="black"></path>
                            </svg>
                        <span className='opacity-0'>Personalizable</span>
                        
                </p>
            </div>
        </div>
    )
}

export default ListaProductos;
