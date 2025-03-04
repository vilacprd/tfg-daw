import { useState, useRef, useEffect } from "react";

export default function Button({ className, style, onClick, children, buttonColor = 'rgb(211 47 47 / 0.78)', innerColor = "rgb(211 47 47 / 1)",textColor = "white",icon }) {
    const buttonRef = useRef(null);
    const [width, setWidth] = useState("0px");
    const [dimensions, setDimensions] = useState({ width: 1, height: 1 });
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    useEffect(() => {
        function updateDimensions() {
            if (buttonRef.current) {
                const { width, height } = buttonRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        }

        updateDimensions();
        window.addEventListener("resize", updateDimensions);

        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const getCoords = e => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const styles = window.getComputedStyle(buttonRef.current);

            const paddingX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
            const paddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom); 
            
            const x = e.clientX - rect.left; // Coordenada X dentro del botón
            const y = e.clientY - rect.top;  // Coordenada Y dentro del botón
            setCoords({ x, y });
            console.log(`x: ${x}, y:${y}`)
        }
    }

    const onFocus = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = rect.width/2; 
            const y = rect.height/2;  
            setCoords({ x, y });
            setWidth('100%');
        }
    }
    const onBlur = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = rect.width/2 ; 
            const y = rect.height / 2;  
            console.log(y)
            setCoords({ x, y });
            setWidth('0');
        }
    }

    const mouseEnter = (e) => {
        getCoords(e)
        setWidth("100%");
    }
    const mouseLeave = (e) => {
        getCoords(e)
        setWidth("0px");
    }

    

    return (
        <button
            ref={buttonRef}
            style={{ ...style,backgroundColor:buttonColor,aspectRatio:'3.5/1' }}
            className={`font-meatWide w-fit backdrop-blur-md bg-opacity-40 overflow-hidden text-white box-border rounded-[32px] px-16 relative flex justify-center items-center outline-none focus:outline-offset-0 focus:outline-cream-dark outline-4 ${className}`}
            onClick={onClick}
            onMouseMove={getCoords}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            
            <span
                style={{
                    clipPath: `circle(${width})`,
                    transform: `translate(${coords.x}px, ${coords.y}px)`,
                    top: "-350%",
                    left:"-100%",
                    width: `200%`,
                    transition: "500ms, transform 100ms ease-out, clip-path 875ms cubic-bezier(0.79, 0.14, 0.15, 0.86)",
                    backgroundColor: innerColor
                }}
                className="origin-center aspect-square absolute bg-opacity-80 pointer-events-none rounded-full z-0"
            />
            <div className="absolute w-full h-full left-0 right-0 top-0 bottom-0 z-20 m-0 gap-1 flex items-center justify-center pointer-events-none" style={{color:textColor}}>
                <div className="w-full h-full pointer-events-none absolute top-0 left-0 flex justify-center items-center gap-2">
                {children}
                </div>
            </div>
            
        </button>
    )   
}