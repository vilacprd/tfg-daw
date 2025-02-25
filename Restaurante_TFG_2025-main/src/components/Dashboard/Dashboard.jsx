import DashboardIntro from "../DashboardIntro/DashboardIntro"
import DashboardSectionWrapper from "../DashboardSectionWrapper/DashboardSectionWrapper";
import { useUser } from "../../context/userContext"

const Estadistica = ({nombre,cifra,icono}) => {
    return (
        <div className=" bg-cream-dark rounded-lg border-beef-light border-opacity-10 border box-border flex gap-4 justify-center items-center p-6">
            <div className="flex flex-col gap-2">
                <span>{nombre}</span>
                <span className="font-bold text-5xl">{cifra}</span>
            </div>
            <div className="w-[40%] bg-cream text-cream rounded-full aspect-square grid place-items-center">
                {icono}
            </div>
        </div>
    )
}

export default function Dashboard() {
    const { usuario } = useUser();

    const estatisticas = [
        {
            nombre: "Platos Vendidos", cifra: 600, icono:
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 35 30" fill="none">
                <path className="fill-beef-light" d="M0 10.1984C0 18.6727 7.034 23.1886 12.183 27.2307C14 28.6571 15.75 30 17.5 30C19.25 30 21 28.6571 22.817 27.2307C27.966 23.1886 35 18.6727 35 10.1984C35 1.72392 25.3747 -4.28597 17.5 3.86124C9.62528 -4.28597 0 1.72392 0 10.1984Z" fill="white"/>
            </svg>
         },
        {
            nombre: "Categorias Activas", cifra: 5, icono: 
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 35 30" fill="none">
                <path className="fill-beef-light" d="M0 10.1984C0 18.6727 7.034 23.1886 12.183 27.2307C14 28.6571 15.75 30 17.5 30C19.25 30 21 28.6571 22.817 27.2307C27.966 23.1886 35 18.6727 35 10.1984C35 1.72392 25.3747 -4.28597 17.5 3.86124C9.62528 -4.28597 0 1.72392 0 10.1984Z" fill="white"/>
            </svg>
        },
        { nombre: "Comensales totales", cifra: 469, icono:  
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 35 30" fill="none">
                <path className="fill-beef-light" d="M0 10.1984C0 18.6727 7.034 23.1886 12.183 27.2307C14 28.6571 15.75 30 17.5 30C19.25 30 21 28.6571 22.817 27.2307C27.966 23.1886 35 18.6727 35 10.1984C35 1.72392 25.3747 -4.28597 17.5 3.86124C9.62528 -4.28597 0 1.72392 0 10.1984Z" fill="white"/>
            </svg>
        },
        { nombre: "Platos Activos", cifra: 18, icono: 
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 35 30" fill="none">
                <path className="fill-beef-light" d="M0 10.1984C0 18.6727 7.034 23.1886 12.183 27.2307C14 28.6571 15.75 30 17.5 30C19.25 30 21 28.6571 22.817 27.2307C27.966 23.1886 35 18.6727 35 10.1984C35 1.72392 25.3747 -4.28597 17.5 3.86124C9.62528 -4.28597 0 1.72392 0 10.1984Z" fill="white"/>
            </svg>
        },
    ]
    const vector = (
        <svg className="margin-auto" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 28 24" fill="none">
            <path className='fill-cream' d="M24.9043 9.80066L26.3902 10.9436C26.5723 11.0833 26.7866 11.1506 26.9995 11.1506C27.2993 11.1506 27.5957 11.0159 27.7925 10.76C28.1294 10.3225 28.0474 9.69458 27.6099 9.35767L16.5864 0.878174C15.063 -0.293701 12.9361 -0.291748 11.4136 0.878174L0.390154 9.35767C-0.0473465 9.69458 -0.129378 10.3225 0.207536 10.76C0.543962 11.1995 1.17287 11.2795 1.60988 10.9436L3.10011 9.7973V18.8811C3.10011 21.219 5.00197 23.1213 7.33986 23.1213H10C10.5523 23.1213 11 22.6741 11 22.1213V16.1213C11 15.5696 11.4487 15.1213 12 15.1213H16C16.5513 15.1213 17 15.5696 17 16.1213V22.1208C17 22.6736 17.4478 23.1213 18 23.1213H20.6602C22.9981 23.1213 24.8999 21.219 24.8999 18.8811C24.8999 18.8085 24.9043 9.80066 24.9043 9.80066Z" fill="white"/>
        </svg>
    )
    return (
            <div className="text-beef">
                <DashboardIntro title={"Inicio"} vector={vector} bgColor="rgb(255 111 0 / 1)" />
            <DashboardSectionWrapper>
                <div className="flex flex-col gap-16">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-5xl font-bold">Bienvenido, {usuario.nombre}</h2>
                        <p className="text-lg">¡Estamos encantados de verte de nuevo!</p>
                    </div>
                    <div style={{gridTemplateColumns:`repeat(${estatisticas.length},1fr)`}} className="grid gap-4 min-h-54 w-full">
                        {estatisticas.map(estadistica => (
                                <Estadistica 
                                key={estadistica.nombre} 
                                nombre={estadistica.nombre} 
                                cifra={estadistica.cifra} 
                                icono={estadistica.icono}
                                />
                            )
                        )}
                    </div>
                </div>
                </DashboardSectionWrapper>
            </div>
    )
}