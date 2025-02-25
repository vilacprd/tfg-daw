export default function DashboardIntro({title,vector,bgColor = "rgb(211 47 47 / 1)"}) {
    return (
        <div style={{backgroundColor:bgColor}} className="px-[5vw] items-center w-full bg-ketchup font-flame text-cream text-3xl h-16 grid grid-cols-3 gap-[3.5vw] justify-items-center">
           
            <div style={{gridColumn:"2/-2"}}>
                {title}
            </div>
            <div className="justify-self-end">
                {vector}
            </div>
          
        </div>
    )
}