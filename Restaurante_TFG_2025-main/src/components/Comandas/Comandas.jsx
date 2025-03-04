import React, { useState, useEffect } from 'react';
import DashboardIntro from '../DashboardIntro/DashboardIntro';
import DashboardSectionWrapper from '../DashboardSectionWrapper/DashboardSectionWrapper';



import ComandaDetailsModal from './ComandaDetailsModal';
import {fetchOrdersActived, socket} from '../../connections';

const Comandas = () => {
  const [mesas, setMesas] = useState([]);
  const [comandas, setComandas] = useState([]);
  const [selectedMesa, setSelectedMesa] = useState(null);

  const mesaVerde = <svg xmlns="http://www.w3.org/2000/svg" width="88" height="50" viewBox="0 0 88 50" fill="none">
  <path className="fill-lettuce" fillRule="evenodd" clipRule="evenodd" d="M6.13376 39.6104L4.23926 48.4424C4.0127 49.4971 2.97366 50.169 1.91896 49.9424C0.864256 49.7158 0.192356 48.6768 0.418956 47.6221L2.22756 39.1768L3.24316 39.4814L4.56736 39.6104H6.13376Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M30.6757 39.5244L32.4101 47.6221C32.6367 48.6768 31.9648 49.7159 30.9101 49.9424C29.8554 50.169 28.8163 49.4971 28.5898 48.4424L26.6953 39.6104H30.2422L30.668 39.5245L30.6757 39.5244Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M85.332 39.1802L87.1406 47.6255C87.3671 48.6802 86.6953 49.7193 85.6406 49.9458C84.5859 50.1723 83.5468 49.5005 83.3203 48.4458L81.4258 39.6138H82.9883L84.3125 39.4849L85.3281 39.1802H85.332Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M60.8623 39.6104L58.9678 48.4424C58.7412 49.4971 57.7022 50.169 56.6475 49.9424C55.5928 49.7159 54.9209 48.6768 55.1475 47.6221L56.8819 39.5244L57.3077 39.6104L60.8623 39.6104Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M67.8755 12.3174C68.4145 12.3174 68.852 12.7549 68.852 13.2939V17.6181C68.852 18.1572 68.4145 18.5947 67.8755 18.5947H19.6055C19.0664 18.5947 18.6289 18.1572 18.6289 17.6181V13.2939C18.6289 12.7549 19.0664 12.3174 19.6055 12.3174H67.8755Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M46.9961 22.5005V39.8015H40.7188V22.5005H46.9961Z" fill="black"/>
  <path className="fill-lettuce"   fillRule="evenodd" clipRule="evenodd" d="M4.57059 35.7074C3.01589 35.7074 1.73079 34.4926 1.64479 32.9379C1.28541 26.3832 0.38309 9.95386 0.00418983 3.08986C-0.0387792 2.28517 0.25028 1.50006 0.80107 0.914061C1.35576 0.328121 2.12527 0 2.92997 0H3.77763C5.14483 0 6.32843 0.94531 6.63313 2.2773C8.13703 8.8632 12.3909 27.4683 12.3909 27.4683H28.2969C29.0743 27.4683 29.8203 27.7769 30.3672 28.3277C30.918 28.8784 31.2266 29.6207 31.2266 30.398V34.7339C31.2266 35.2729 30.7891 35.7104 30.25 35.7104H4.57005L4.57059 35.7074Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M82.992 35.7074C84.5467 35.7074 85.8318 34.4926 85.9178 32.9379C86.2771 26.3832 87.1795 9.95386 87.5584 3.08986C87.6013 2.28517 87.3123 1.50006 86.7615 0.914061C86.2068 0.328121 85.4373 0 84.6326 0H83.7849C82.4177 0 81.2341 0.94531 80.9294 2.2773C79.4255 8.8632 75.1716 27.4683 75.1716 27.4683H59.2656C58.4883 27.4683 57.7422 27.7769 57.1953 28.3277C56.6445 28.8784 56.3359 29.6207 56.3359 30.398V34.7339C56.3359 35.2729 56.7734 35.7104 57.3125 35.7104H82.9925L82.992 35.7074Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M49.0825 43.7075C49.6215 43.7075 50.059 44.145 50.059 44.6841V49.0083C50.059 49.5473 49.6215 49.9848 49.0825 49.9848H38.4805C37.9414 49.9848 37.5039 49.5473 37.5039 49.0083V44.6841C37.5039 44.145 37.9414 43.7075 38.4805 43.7075H49.0825Z" fill="black"/>
  </svg>
  const mesaRoja = <svg xmlns="http://www.w3.org/2000/svg" width="88" height="50" viewBox="0 0 88 50" fill="none">
  <path className="fill-ketchup" fillRule="evenodd" clipRule="evenodd" d="M6.13376 39.6104L4.23926 48.4424C4.0127 49.4971 2.97366 50.169 1.91896 49.9424C0.864256 49.7158 0.192356 48.6768 0.418956 47.6221L2.22756 39.1768L3.24316 39.4814L4.56736 39.6104H6.13376Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M30.6757 39.5244L32.4101 47.6221C32.6367 48.6768 31.9648 49.7159 30.9101 49.9424C29.8554 50.169 28.8163 49.4971 28.5898 48.4424L26.6953 39.6104H30.2422L30.668 39.5245L30.6757 39.5244Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M85.332 39.1802L87.1406 47.6255C87.3671 48.6802 86.6953 49.7193 85.6406 49.9458C84.5859 50.1723 83.5468 49.5005 83.3203 48.4458L81.4258 39.6138H82.9883L84.3125 39.4849L85.3281 39.1802H85.332Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M60.8623 39.6104L58.9678 48.4424C58.7412 49.4971 57.7022 50.169 56.6475 49.9424C55.5928 49.7159 54.9209 48.6768 55.1475 47.6221L56.8819 39.5244L57.3077 39.6104L60.8623 39.6104Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M67.8755 12.3174C68.4145 12.3174 68.852 12.7549 68.852 13.2939V17.6181C68.852 18.1572 68.4145 18.5947 67.8755 18.5947H19.6055C19.0664 18.5947 18.6289 18.1572 18.6289 17.6181V13.2939C18.6289 12.7549 19.0664 12.3174 19.6055 12.3174H67.8755Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M46.9961 22.5005V39.8015H40.7188V22.5005H46.9961Z" fill="black"/>
  <path className="fill-ketchup"   fillRule="evenodd" clipRule="evenodd" d="M4.57059 35.7074C3.01589 35.7074 1.73079 34.4926 1.64479 32.9379C1.28541 26.3832 0.38309 9.95386 0.00418983 3.08986C-0.0387792 2.28517 0.25028 1.50006 0.80107 0.914061C1.35576 0.328121 2.12527 0 2.92997 0H3.77763C5.14483 0 6.32843 0.94531 6.63313 2.2773C8.13703 8.8632 12.3909 27.4683 12.3909 27.4683H28.2969C29.0743 27.4683 29.8203 27.7769 30.3672 28.3277C30.918 28.8784 31.2266 29.6207 31.2266 30.398V34.7339C31.2266 35.2729 30.7891 35.7104 30.25 35.7104H4.57005L4.57059 35.7074Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M82.992 35.7074C84.5467 35.7074 85.8318 34.4926 85.9178 32.9379C86.2771 26.3832 87.1795 9.95386 87.5584 3.08986C87.6013 2.28517 87.3123 1.50006 86.7615 0.914061C86.2068 0.328121 85.4373 0 84.6326 0H83.7849C82.4177 0 81.2341 0.94531 80.9294 2.2773C79.4255 8.8632 75.1716 27.4683 75.1716 27.4683H59.2656C58.4883 27.4683 57.7422 27.7769 57.1953 28.3277C56.6445 28.8784 56.3359 29.6207 56.3359 30.398V34.7339C56.3359 35.2729 56.7734 35.7104 57.3125 35.7104H82.9925L82.992 35.7074Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M49.0825 43.7075C49.6215 43.7075 50.059 44.145 50.059 44.6841V49.0083C50.059 49.5473 49.6215 49.9848 49.0825 49.9848H38.4805C37.9414 49.9848 37.5039 49.5473 37.5039 49.0083V44.6841C37.5039 44.145 37.9414 43.7075 38.4805 43.7075H49.0825Z" fill="black"/>
  </svg>

  useEffect(() => {
    // Simulated data for mesas
    const mesasData = [
      { id: 1, numero: 1, activa: false, comandas: [] },
      { id: 2, numero: 2, activa: false, comandas: [] },
      { id: 3, numero: 3, activa: false, comandas: [] },
      { id: 4, numero: 4, activa: false, comandas: [] },
      { id: 5, numero: 5, activa: false, comandas: [] },
      { id: 6, numero: 6, activa: false, comandas: [] },
      { id: 7, numero: 7, activa: false, comandas: [] },
      { id: 8, numero: 8, activa: false, comandas: [] },
      { id: 9, numero: 9, activa: false, comandas: [] },
      { id: 10, numero: 10, activa: false, comandas: [] }
    ];
    setMesas(mesasData);
  }, []);

  useEffect(() => {
    const cargarComandas = async () => {
      try {
        var comandasActivas = await fetchOrdersActived(); // ✅ Esperamos la respuesta
        console.log("COMANDA ACTIVAS", comandasActivas);
        setComandas(comandasActivas); // ✅ Ahora tiene los datos correctos
      } catch (error) {
        console.error("Error al obtener las comandas activas", error);
      }
    };

    cargarComandas();
  }, []);

  useEffect(() => {
    socket.on('NewOrder', (newComanda) => {

        var mesaComanda = mesas.findIndex(mesa => Number(mesa.numero) === Number(newComanda.mesa));
        console.log("MESA COMANDA", mesaComanda);

        if (mesaComanda !== -1) { 
            // Clonar el estado correctamente
            var mesasActualizadas = [...mesas];
            mesasActualizadas[mesaComanda] = {
                ...mesasActualizadas[mesaComanda],
                comandas: [...mesasActualizadas[mesaComanda].comandas, newComanda],
                activa: true
            };
            
            console.log("MESA ACTUALIZADA", mesasActualizadas);
            setMesas(mesasActualizadas);

            // Reload the modal if it is open
            if (selectedMesa && selectedMesa.numero === newComanda.mesa) {
              setSelectedMesa(mesasActualizadas[mesaComanda]);
            }

        } else {
            console.warn("Mesa no encontrada para la comanda:", newComanda);
        }
    });

    return () => socket.off('NewOrder');
}, [mesas, selectedMesa]); // Dependencia del useEffect

  useEffect(() => {
    setMesas(prevMesas => {
      const updatedMesas = prevMesas.map(mesa => {
        const mesaComandas =  comandas.filter(comanda => comanda.mesa === mesa.numero);
        return { ...mesa, comandas: mesaComandas, activa: mesaComandas.length > 0 };
      });
      return updatedMesas;
    });
  }, [comandas]);

  const handleMesaClick = (mesa) => {
    setSelectedMesa(mesa);
  };

  const closeModal = () => {
    setSelectedMesa(null);
  };

  const vector = <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" viewBox="0 0 27 20" fill="none"><path className="fill-cream" d="M25.8322 11.667H20.8324H0.833298C0.373317 11.667 0 12.0403 0 12.5003V15.8335C0 18.1317 1.86992 20 4.16649 20H17.4992C19.5125 20 21.1941 18.5667 21.5807 16.6668H25.8322C26.2922 16.6668 26.6655 16.2935 26.6655 15.8335V12.5003C26.6655 12.0403 26.2922 11.667 25.8322 11.667Z" fill="white"></path><path className="fill-cream" d="M17.3925 4.59224C16.8392 3.60728 17.1859 3.16563 17.2409 3.10397C17.5642 2.79565 17.5892 2.284 17.2892 1.94735C16.9825 1.60237 16.4542 1.5707 16.1126 1.87736C16.0542 1.93069 14.6876 3.1823 15.9392 5.40887C16.5042 6.41216 16.1342 6.85214 16.1126 6.87714C15.7693 7.18213 15.7359 7.71044 16.0426 8.05376C16.2076 8.23875 16.4359 8.33374 16.6659 8.33374C16.8625 8.33374 17.0609 8.26375 17.2192 8.12375C17.2775 8.07209 18.6441 6.81881 17.3925 4.59224Z" fill="white"></path><path className="fill-cream" d="M11.5589 2.92573C11.0056 1.94078 11.3522 1.49913 11.4072 1.43747C11.7305 1.12915 11.7539 0.6175 11.4555 0.280848C11.1489 -0.0641368 10.6222 -0.0958019 10.2789 0.210851C10.2189 0.264182 8.85398 1.51579 10.1056 3.74237C10.6706 4.74566 10.2989 5.18564 10.2789 5.21064C9.93394 5.51562 9.90394 6.04393 10.2089 6.38725C10.3739 6.57224 10.6022 6.66724 10.8322 6.66724C11.0289 6.66724 11.2272 6.59724 11.3855 6.45725C11.4455 6.40558 12.8105 5.15231 11.5589 2.92573Z" fill="white"></path><path className="fill-cream" d="M5.72586 4.59273C5.17255 3.60777 5.5192 3.16612 5.5742 3.10446C5.89752 2.79614 5.92085 2.28449 5.62253 1.94784C5.31588 1.60286 4.78923 1.57119 4.44591 1.87784C4.38592 1.93117 3.02097 3.18279 4.27259 5.40936C4.83756 6.41265 4.46591 6.85263 4.44591 6.87763C4.10093 7.18262 4.07093 7.71093 4.37592 8.05424C4.54091 8.23924 4.76923 8.33423 4.99922 8.33423C5.19588 8.33423 5.39421 8.26424 5.55253 8.12424C5.61253 8.07258 6.97747 6.8193 5.72586 4.59273Z" fill="white"></path></svg>


  if (comandas.length === 0) {
    return (
      <>
      <DashboardIntro bgColor='rgb(56 9 6 / 1)' title={"Comandas"} vector={vector} />
      <DashboardSectionWrapper>
      <div className="grid grid-cols-3 gap-3 ml-[0px] max-h-screen mb-52 box-border">
        {[...Array(10).fill(null)].map((_,index) => {
          return (
           
            
            <MesaCardSkeleton key={index}  />
            
          );
        })}
      </div>
      
      </DashboardSectionWrapper>
    </>
    )
  } else {
    return (
    
      <>
      <DashboardIntro bgColor='rgb(56 9 6 / 1)' title={"Comandas"} vector={vector} />
      <DashboardSectionWrapper>
      <div className="grid grid-cols-3 gap-3 ml-[0px] max-h-screen mb-52 box-border">
        {mesas.map((mesa) => {
          return (
           
            
              <MesaCard key={mesa.id} mesa={mesa} onClick={() => handleMesaClick(mesa)} />
            
          );
        })}
      </div>
      {selectedMesa && (
        <ComandaDetailsModal mesa={selectedMesa} onClose={closeModal} mesas={mesas} setMesas={setMesas} />
      )}
      
      </DashboardSectionWrapper>
    </>
  );
  }
  
};

const MesaCard = ({ mesa, onClick }) => {
  
  const elementoAleatorio = array => {
    return array[Math.floor(Math.random() * array.length)];
  }

  const imagenes = Object.values(import.meta.glob('./img/*.jpg', { eager: true }))
  .map(module => module.default)




  const mesaVerde = <svg className='w-3/5 h-3/5'  xmlns="http://www.w3.org/2000/svg" width="88" height="50" viewBox="0 0 88 50" fill="none">
  <path className="fill-lettuce" fillRule="evenodd" clipRule="evenodd" d="M6.13376 39.6104L4.23926 48.4424C4.0127 49.4971 2.97366 50.169 1.91896 49.9424C0.864256 49.7158 0.192356 48.6768 0.418956 47.6221L2.22756 39.1768L3.24316 39.4814L4.56736 39.6104H6.13376Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M30.6757 39.5244L32.4101 47.6221C32.6367 48.6768 31.9648 49.7159 30.9101 49.9424C29.8554 50.169 28.8163 49.4971 28.5898 48.4424L26.6953 39.6104H30.2422L30.668 39.5245L30.6757 39.5244Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M85.332 39.1802L87.1406 47.6255C87.3671 48.6802 86.6953 49.7193 85.6406 49.9458C84.5859 50.1723 83.5468 49.5005 83.3203 48.4458L81.4258 39.6138H82.9883L84.3125 39.4849L85.3281 39.1802H85.332Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M60.8623 39.6104L58.9678 48.4424C58.7412 49.4971 57.7022 50.169 56.6475 49.9424C55.5928 49.7159 54.9209 48.6768 55.1475 47.6221L56.8819 39.5244L57.3077 39.6104L60.8623 39.6104Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M67.8755 12.3174C68.4145 12.3174 68.852 12.7549 68.852 13.2939V17.6181C68.852 18.1572 68.4145 18.5947 67.8755 18.5947H19.6055C19.0664 18.5947 18.6289 18.1572 18.6289 17.6181V13.2939C18.6289 12.7549 19.0664 12.3174 19.6055 12.3174H67.8755Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M46.9961 22.5005V39.8015H40.7188V22.5005H46.9961Z" fill="black"/>
  <path className="fill-lettuce"   fillRule="evenodd" clipRule="evenodd" d="M4.57059 35.7074C3.01589 35.7074 1.73079 34.4926 1.64479 32.9379C1.28541 26.3832 0.38309 9.95386 0.00418983 3.08986C-0.0387792 2.28517 0.25028 1.50006 0.80107 0.914061C1.35576 0.328121 2.12527 0 2.92997 0H3.77763C5.14483 0 6.32843 0.94531 6.63313 2.2773C8.13703 8.8632 12.3909 27.4683 12.3909 27.4683H28.2969C29.0743 27.4683 29.8203 27.7769 30.3672 28.3277C30.918 28.8784 31.2266 29.6207 31.2266 30.398V34.7339C31.2266 35.2729 30.7891 35.7104 30.25 35.7104H4.57005L4.57059 35.7074Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M82.992 35.7074C84.5467 35.7074 85.8318 34.4926 85.9178 32.9379C86.2771 26.3832 87.1795 9.95386 87.5584 3.08986C87.6013 2.28517 87.3123 1.50006 86.7615 0.914061C86.2068 0.328121 85.4373 0 84.6326 0H83.7849C82.4177 0 81.2341 0.94531 80.9294 2.2773C79.4255 8.8632 75.1716 27.4683 75.1716 27.4683H59.2656C58.4883 27.4683 57.7422 27.7769 57.1953 28.3277C56.6445 28.8784 56.3359 29.6207 56.3359 30.398V34.7339C56.3359 35.2729 56.7734 35.7104 57.3125 35.7104H82.9925L82.992 35.7074Z" fill="black"/>
  <path className="fill-lettuce"  fillRule="evenodd" clipRule="evenodd" d="M49.0825 43.7075C49.6215 43.7075 50.059 44.145 50.059 44.6841V49.0083C50.059 49.5473 49.6215 49.9848 49.0825 49.9848H38.4805C37.9414 49.9848 37.5039 49.5473 37.5039 49.0083V44.6841C37.5039 44.145 37.9414 43.7075 38.4805 43.7075H49.0825Z" fill="black"/>
  </svg>
  const mesaRoja = <svg className='w-3/5 h-3/5' xmlns="http://www.w3.org/2000/svg" width="88" height="50" viewBox="0 0 88 50" fill="none">
  <path className="fill-ketchup" fillRule="evenodd" clipRule="evenodd" d="M6.13376 39.6104L4.23926 48.4424C4.0127 49.4971 2.97366 50.169 1.91896 49.9424C0.864256 49.7158 0.192356 48.6768 0.418956 47.6221L2.22756 39.1768L3.24316 39.4814L4.56736 39.6104H6.13376Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M30.6757 39.5244L32.4101 47.6221C32.6367 48.6768 31.9648 49.7159 30.9101 49.9424C29.8554 50.169 28.8163 49.4971 28.5898 48.4424L26.6953 39.6104H30.2422L30.668 39.5245L30.6757 39.5244Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M85.332 39.1802L87.1406 47.6255C87.3671 48.6802 86.6953 49.7193 85.6406 49.9458C84.5859 50.1723 83.5468 49.5005 83.3203 48.4458L81.4258 39.6138H82.9883L84.3125 39.4849L85.3281 39.1802H85.332Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M60.8623 39.6104L58.9678 48.4424C58.7412 49.4971 57.7022 50.169 56.6475 49.9424C55.5928 49.7159 54.9209 48.6768 55.1475 47.6221L56.8819 39.5244L57.3077 39.6104L60.8623 39.6104Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M67.8755 12.3174C68.4145 12.3174 68.852 12.7549 68.852 13.2939V17.6181C68.852 18.1572 68.4145 18.5947 67.8755 18.5947H19.6055C19.0664 18.5947 18.6289 18.1572 18.6289 17.6181V13.2939C18.6289 12.7549 19.0664 12.3174 19.6055 12.3174H67.8755Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M46.9961 22.5005V39.8015H40.7188V22.5005H46.9961Z" fill="black"/>
  <path className="fill-ketchup"   fillRule="evenodd" clipRule="evenodd" d="M4.57059 35.7074C3.01589 35.7074 1.73079 34.4926 1.64479 32.9379C1.28541 26.3832 0.38309 9.95386 0.00418983 3.08986C-0.0387792 2.28517 0.25028 1.50006 0.80107 0.914061C1.35576 0.328121 2.12527 0 2.92997 0H3.77763C5.14483 0 6.32843 0.94531 6.63313 2.2773C8.13703 8.8632 12.3909 27.4683 12.3909 27.4683H28.2969C29.0743 27.4683 29.8203 27.7769 30.3672 28.3277C30.918 28.8784 31.2266 29.6207 31.2266 30.398V34.7339C31.2266 35.2729 30.7891 35.7104 30.25 35.7104H4.57005L4.57059 35.7074Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M82.992 35.7074C84.5467 35.7074 85.8318 34.4926 85.9178 32.9379C86.2771 26.3832 87.1795 9.95386 87.5584 3.08986C87.6013 2.28517 87.3123 1.50006 86.7615 0.914061C86.2068 0.328121 85.4373 0 84.6326 0H83.7849C82.4177 0 81.2341 0.94531 80.9294 2.2773C79.4255 8.8632 75.1716 27.4683 75.1716 27.4683H59.2656C58.4883 27.4683 57.7422 27.7769 57.1953 28.3277C56.6445 28.8784 56.3359 29.6207 56.3359 30.398V34.7339C56.3359 35.2729 56.7734 35.7104 57.3125 35.7104H82.9925L82.992 35.7074Z" fill="black"/>
  <path className="fill-ketchup"  fillRule="evenodd" clipRule="evenodd" d="M49.0825 43.7075C49.6215 43.7075 50.059 44.145 50.059 44.6841V49.0083C50.059 49.5473 49.6215 49.9848 49.0825 49.9848H38.4805C37.9414 49.9848 37.5039 49.5473 37.5039 49.0083V44.6841C37.5039 44.145 37.9414 43.7075 38.4805 43.7075H49.0825Z" fill="black"/>
  </svg>

  return (
    <div  onClick={onClick} style={{aspectRatio:"1/0.6"}} className='hover:cursor-pointer rounded-xl overflow-hidden border border-beef/10 bg-cream'>
      <div className='h-[75%] relative overflow-hidden'>
        <img alt="Hamburguesa" src={elementoAleatorio(imagenes)} className={`brightness-75 max-w-[110%] max-h-[110%] z-10 absolute w-[110%] h-[110%] top-[-5%] left-[-5%] object-cover object-center opacity-80 ${!mesa.activa ? "blur-md" : ""}`} />
        <div className='absolute w-full h-full grid place-items-center z-20'>
        {mesa.activa ? mesaVerde : mesaRoja}
        </div>
      </div>
      <div className='h-[25%] bg-beef box-border p-4 flex justify-between items-center text-cream font-flame py-[1px] overflow-hidden'>
        <h1 className='text-2xl'>Mesa {mesa.numero}</h1>

        <div className={` grid place-items-center px-6 py-[6px] rounded-3xl ${mesa.activa ? "bg-lettuce" : "bg-ketchup"}`}>{mesa.activa ? "Activa" : "Inactiva"}</div>
      </div>
    </div>
  )
}

const MesaCardSkeleton = () => {
  
  const mesa = <svg className='w-3/5 h-3/5'  xmlns="http://www.w3.org/2000/svg" width="88" height="50" viewBox="0 0 88 50" fill="none">
  <path className="fill-beef" fillRule="evenodd" clipRule="evenodd" d="M6.13376 39.6104L4.23926 48.4424C4.0127 49.4971 2.97366 50.169 1.91896 49.9424C0.864256 49.7158 0.192356 48.6768 0.418956 47.6221L2.22756 39.1768L3.24316 39.4814L4.56736 39.6104H6.13376Z" fill="black"/>
  <path className="fill-beef"  fillRule="evenodd" clipRule="evenodd" d="M30.6757 39.5244L32.4101 47.6221C32.6367 48.6768 31.9648 49.7159 30.9101 49.9424C29.8554 50.169 28.8163 49.4971 28.5898 48.4424L26.6953 39.6104H30.2422L30.668 39.5245L30.6757 39.5244Z" fill="black"/>
  <path className="fill-beef"  fillRule="evenodd" clipRule="evenodd" d="M85.332 39.1802L87.1406 47.6255C87.3671 48.6802 86.6953 49.7193 85.6406 49.9458C84.5859 50.1723 83.5468 49.5005 83.3203 48.4458L81.4258 39.6138H82.9883L84.3125 39.4849L85.3281 39.1802H85.332Z" fill="black"/>
  <path className="fill-beef"  fillRule="evenodd" clipRule="evenodd" d="M60.8623 39.6104L58.9678 48.4424C58.7412 49.4971 57.7022 50.169 56.6475 49.9424C55.5928 49.7159 54.9209 48.6768 55.1475 47.6221L56.8819 39.5244L57.3077 39.6104L60.8623 39.6104Z" fill="black"/>
  <path className="fill-beef"  fillRule="evenodd" clipRule="evenodd" d="M67.8755 12.3174C68.4145 12.3174 68.852 12.7549 68.852 13.2939V17.6181C68.852 18.1572 68.4145 18.5947 67.8755 18.5947H19.6055C19.0664 18.5947 18.6289 18.1572 18.6289 17.6181V13.2939C18.6289 12.7549 19.0664 12.3174 19.6055 12.3174H67.8755Z" fill="black"/>
  <path className="fill-beef"  fillRule="evenodd" clipRule="evenodd" d="M46.9961 22.5005V39.8015H40.7188V22.5005H46.9961Z" fill="black"/>
  <path className="fill-beef"   fillRule="evenodd" clipRule="evenodd" d="M4.57059 35.7074C3.01589 35.7074 1.73079 34.4926 1.64479 32.9379C1.28541 26.3832 0.38309 9.95386 0.00418983 3.08986C-0.0387792 2.28517 0.25028 1.50006 0.80107 0.914061C1.35576 0.328121 2.12527 0 2.92997 0H3.77763C5.14483 0 6.32843 0.94531 6.63313 2.2773C8.13703 8.8632 12.3909 27.4683 12.3909 27.4683H28.2969C29.0743 27.4683 29.8203 27.7769 30.3672 28.3277C30.918 28.8784 31.2266 29.6207 31.2266 30.398V34.7339C31.2266 35.2729 30.7891 35.7104 30.25 35.7104H4.57005L4.57059 35.7074Z" fill="black"/>
  <path className="fill-beef"  fillRule="evenodd" clipRule="evenodd" d="M82.992 35.7074C84.5467 35.7074 85.8318 34.4926 85.9178 32.9379C86.2771 26.3832 87.1795 9.95386 87.5584 3.08986C87.6013 2.28517 87.3123 1.50006 86.7615 0.914061C86.2068 0.328121 85.4373 0 84.6326 0H83.7849C82.4177 0 81.2341 0.94531 80.9294 2.2773C79.4255 8.8632 75.1716 27.4683 75.1716 27.4683H59.2656C58.4883 27.4683 57.7422 27.7769 57.1953 28.3277C56.6445 28.8784 56.3359 29.6207 56.3359 30.398V34.7339C56.3359 35.2729 56.7734 35.7104 57.3125 35.7104H82.9925L82.992 35.7074Z" fill="black"/>
  <path className="fill-beef"  fillRule="evenodd" clipRule="evenodd" d="M49.0825 43.7075C49.6215 43.7075 50.059 44.145 50.059 44.6841V49.0083C50.059 49.5473 49.6215 49.9848 49.0825 49.9848H38.4805C37.9414 49.9848 37.5039 49.5473 37.5039 49.0083V44.6841C37.5039 44.145 37.9414 43.7075 38.4805 43.7075H49.0825Z" fill="black"/>
  </svg>
  

  return (
    <div  style={{aspectRatio:"1/0.6"}} className='pointer-events-none hover:cursor-pointer rounded-xl overflow-hidden border border-beef/10 bg-cream'>
      <div className='h-[75%] relative overflow-hidden'>
        <div className='absolute w-full h-full grid place-items-center z-20 bg-beef/60 animate-pulse'>
        {mesa}
        </div>
      </div>
      <div className='h-[25%] bg-beef box-border p-4 flex justify-between items-center text-cream font-flame py-[1px] overflow-hidden'>
        <h1 className='text-2xl bg-beef-light rounded-2xl animate-pulse'><span className='opacity-0'>Mesa 33</span></h1>

        <div className={` grid place-items-center px-6 py-[6px] rounded-3xl bg-cheddar/50 animate-pulse`}><span className='opacity-0'>Activa</span></div>
      </div>
    </div>
  )
}


export default Comandas;
