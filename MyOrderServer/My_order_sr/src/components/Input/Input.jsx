export default function Input({ type, style, className, placeHolder, value, onChange }) {
    return (
        <div className="relative group transition-all">
            <input
                className={`transition-all bg-transparent border border-opacity-60 rounded-sm border-beef w-full h-12 px-4 outline-none outline-offset-0 focus:outline-cream-dark outline-4 ${className} ${value !== "" ? "!outline-lettuce" : ""}`}
                style={{ ...style }}
                type={type}
                value={value} // ✅ Ahora es controlado externamente
                onChange={onChange} // ✅ Maneja cambios desde el padre (Login.jsx)
            />
            <p className={`transition-all px-4 pointer-events-none absolute w-full h-full top-0 left-0 m-0 flex items-center group-focus-within:text-xs group-focus-within:translate-y-[-52.5%] ${value !== "" ? "text-xs translate-y-[-52.5%]" : ""}`}>
                <span className={`text-beef transition-all rounded-full group-focus-within:bg-cream-dark group-focus-within:px-4 group-focus-within:py-1 relative ${value !== "" ? "!bg-lettuce px-4 py-1 text-white" : ""}`}>
                    {placeHolder}
                    <span
                        style={{ clipPath: "polygon(0 55.8%, 100% 55.8%, 100% 100%, 0% 100%)" }}
                        className={`transition-all absolute rounded-full group-focus-within:bg-opacity-60 group-focus-within:bg-beef w-[101.5%] h-[102%] top-[1.8%] left-[-0.75%] z-[-1] ${value !== "" ? "bg-opacity-60 bg-beef" : ""}`}
                    ></span>
                </span>
            </p>
        </div>
    );
}
