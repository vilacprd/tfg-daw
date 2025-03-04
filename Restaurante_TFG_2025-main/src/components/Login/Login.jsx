import LogoStroke from '../LogoStroke/LogoStroke'
import Burger from "./burger.png"
import Letters from '../Letters/Letters'
import Button from '../Button/Button'
import LetterTexture from '../LetterTexture/LetterTexture'
import Input from '../Input/Input'
import { useUser } from '../../context/userContext'
import { useState } from 'react';

export default function Login() {
  
  
  const { login } = useUser();

  const [usuario, setUsuario] = useState({ nombre: "", password: "" })
  const [error, setError] = useState("");

  // Función para manejar el login
  const handleLogin = async (e) => {
    e.preventDefault();

  // Depuración: Verifica los valores de nombre y password
  console.log(`Intentando login con nombre:${usuario.nombre}, password:${usuario.password} }`);

    try {
      const response = await fetch("http://localhost:3000/server/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre:usuario.nombre, password:usuario.password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }
      // Guardar token y usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      
      login(data.usuario);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-w-screen min-h-screen relative">
      <div className="w-screen h-screen overflow-hidden fixed top-0 left-0">
        <div className="absolute w-screen h-[50%] md:w-[30%] md:h-full bg-cream dark:bg-cream-dark top-0 md:top-0 left-0 z-0 overflow-hidden">
          <LetterTexture fill={"#2B0200"} className="opacity-100 h-[150%] md:h-[115%] w-fit left-[-5%] md:left-[-2.5%] top-[-10%] max-w-[1000vw] fixed" />
          {/* Aquí puedes agregar más elementos si lo deseas */}
        </div>
        <div className="absolute w-screen md:w-[70%] h-[50%] md:h-full top-1/2 md:top-0 right-0 z-0 isolate overflow-hidden">
          <div className="z-10 absolute bg-beef box-border pt-[40%] grid place-items-center w-[150%] h-[150%] top-[-50%] left-[-25%]">
            <Letters
              fill={'#eab308'}
              className="w-[50%] h-fit min-w-[720px] hidden md:block"
              style={{ transform: "scaleY(125%)" }}
            />
            <LogoStroke bunStroke={"#eab308"} hungryStroke={"#eab308"} joeStroke={"#eab308"} className="min-w-[40px] h-fit z-50 absolute right-[18%] bottom-[1.5%] w-[3.5%] object-contain object-center" />
          </div>
          <div
            style={{ clipPath: "circle(0%)" }}
            className="box-border pt-[40%] grid place-items-center animate-reveal transition-[clip-path] duration-300 ease z-10 absolute w-[150%] h-[150%] top-[-50%] left-[-25%] bg-gradient-to-r from-mustard to-yellow-500"
          >
            <Letters
              fill={'rgb(43 2 0 / 1)'}
              className="w-[50%] h-fit z-0 min-w-[720px] hidden md:block"
              style={{ transform: "scaleY(125%)" }}
            />
            <LogoStroke bunStroke={"rgb(43 2 0 / 1)"} joeStroke={"rgb(43 2 0 / 1)"} hungryStroke={"rgb(43 2 0 / 1)"} className="min-w-[40px] h-fit z-50 absolute right-[18%] bottom-[1.5%] w-[3.5%] object-contain object-center" />
          </div>
          <img
            className="scale-[2.7] sm:scale-[2] md:scale-100 z-20 absolute rotate-8 top-1/4 left-[30%] w-2/5 object-contain object-center"
            src={Burger}
            alt="Hamburger and fries on a dark background."
          />
        </div>
      </div>
      <form
        style={{ backdropFilter: "blur(10px)" }}
        onSubmit={handleLogin}
        className="relative w-[90vw] ml-auto mr-auto md:mr-0 max-w-[450px] md:w-[450px] h-fit bg-white bg-opacity-80 z-10 md:ml-[3vw] xl:ml-[6vw] 2xl:ml-[10.5vw] top-[15vh] md:top-[10vh] xl:top-[14vh] 2xl:top-[18vh] rounded-2xl px-8 pt-14 pb-10 flex flex-col gap-8"
      >
        <div className="w-full absolute bg-beef h-[1px] top-14 left-0 bg-opacity-10"></div>
        <div style={{ left: "calc(50% - 32.5px)" }} className="absolute rounded-full w-[75px] aspect-square top-[-35px] grid place-items-center">
          <LogoStroke
            className="h-fit w-[72%] mt-[5%] relative z-10"
            bunStroke={"#FF6F00"}
            hungryStroke={"#2B0200"}
            joeStroke={"#2B0200"}
          />
          <div style={{ clipPath: "polygon(0px 0px, 100% 0px, 100% 47.12%, 0px 47.12%)", backdropFilter: "blur(10px)" }} className="h-full w-full bg-white bg-opacity-80 absolute z-0 rounded-full"></div>
        </div>
        <div className="mt-6 mb-4 text-beef">
          <h3 className="leading-[88%] font-flame text-5xl w-full text-center font-bold mb-4">Bienvenido a Hungry Joes</h3>
          <p>Por favor, introduce tu nombre de usuario junto a tu contraseña para continuar.</p>
        </div>
        {/* Input para el nombre de usuario */}
        <Input 
            type="text" 
            className="w-full grow text-beef" 
            placeHolder="Usuario"
            value={usuario.nombre} // ✅ Ahora es controlado por Login.jsx
          onChange={(e) => {
              console.log("Nuevo nombre ingresado:", e.target.value); // Metete los comentarios de chatgpt por el culo de verdad
              setUsuario({...usuario,nombre:e.target.value})
            }}
        />

        <Input 
            type="password" 
            className="w-full grow text-beef" 
            placeHolder="Contraseña"
            value={usuario.password} // ✅ Controlado externamente
            onChange={(e) => {
              console.log("Nueva contraseña ingresada:", e.target.value); // 🚀 Depuración
              setUsuario({ ...usuario, password: e.target.value.trim() });
            }}
        />

        {error && <p className="text-red-500 text-center">{error}</p>}
        <Button icon={"icon-home"} className="w-full max-w-[200px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
            <path d="M0.805579 8.05524H6.67427L5.92535 8.80417C5.61146 9.11805 5.61146 9.62781 5.92535 9.94407C6.08268 10.1014 6.28801 10.1801 6.4949 10.1801C6.70257 10.1801 6.90791 10.1014 7.06445 9.94407L9.18931 7.81921C9.50319 7.50532 9.50319 6.99556 9.18931 6.6793L7.06445 4.55524C6.75056 4.24135 6.2408 4.24135 5.92454 4.55524C5.61065 4.86913 5.61065 5.37888 5.92454 5.69515L6.67425 6.44408H0.805559C0.360306 6.44408 0 6.80438 0 7.24964C0 7.69489 0.360327 8.05524 0.805579 8.05524Z" fill="white"/>
            <path d="M11.5486 0H4.92332C3.91873 0 3.10059 0.817362 3.10059 1.82274V3.76583C3.10059 4.21108 3.46089 4.57139 3.90614 4.57139C4.3514 4.57139 4.7117 4.21108 4.7117 3.76583V1.82274C4.7117 1.70631 4.8061 1.61112 4.92332 1.61112H11.5486C11.6651 1.61112 11.7603 1.70552 11.7603 1.82274V12.6773C11.7603 12.7937 11.6659 12.8889 11.5486 12.8889H4.92332C4.8069 12.8889 4.7117 12.7945 4.7117 12.6773V10.7074C4.7117 10.2622 4.3514 9.90186 3.90614 9.90186C3.46089 9.90186 3.10059 10.2622 3.10059 10.7074V12.6773C3.10059 13.6819 3.91795 14.5 4.92332 14.5H11.5486C12.5532 14.5 13.3714 13.6826 13.3714 12.6773V1.82274C13.3714 0.817362 12.554 0 11.5486 0Z" fill="white"/>
          </svg>
          <p>Iniciar Sesión</p>
        </Button>
      </form>
    </div>
  );
}
