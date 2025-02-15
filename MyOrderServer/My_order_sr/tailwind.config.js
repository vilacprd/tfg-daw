export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          flame: ['Flame', 'Times new Roman'], // times new roman por si no pilla la fuente que sea obvio
          meatWide:['SansMeatWide', 'Times new Roman'],
        },
        animation: {
          reveal: "reveal 1.8s 1s ease-in-out forwards",
        },
        keyframes: {
          reveal: {
            "0%": { clipPath: "circle(0%)" },
            "100%": { clipPath: "circle(100%)" },
          },
        },
        colors: {
          "main-color": {
            light: "red",
            DEFAULT: "#FFC72C",
            dark:"green",
          },
          // mustard: '#FFC72C',
          mustard: "#FFD769",
          ketchup: '#D32F2F', 
          cheddar: '#FF6F00',
          cream: "#F5EBDC", 
          "cream-dark": "#EFE1CC",
          lettuce:"#4BA864",
          beef: "#2B0200",

        }
      },
    },
    plugins: [],
  }
  
  // @font-face {
  //   font-family:sans-meat;
  //   src:url(/_next/static/media/sansmeat-proportional-bold.048f4e11.woff2) format("woff2");
  //   font-style:normal;
  //   font-weight:700;
  //   font-stretch:normal;
  //   font-display:swap
  // }
  // @font-face {
  //   font-family:sans-meat;
  //   src:url(/_next/static/media/sansmeat-proportional-regular.7386a06b.woff2) format("woff2");
  //   font-style:normal;
  //   font-weight:400;
  //   font-stretch:normal;
  //   font-display:swap
  // }
  // @font-face {
  //   font-family:sans-meat;
  //   src:url(/_next/static/media/sansmeat-compressed-bold.0b224647.woff2) format("woff2");
  //   font-style:normal;
  //   font-weight:700;
  //   font-stretch:condensed;
  //   font-display:swap
  // }
  // @font-face {
  //   font-family:sans-meat;
  //   src:url(/_next/static/media/sansmeat-compressed-regular.6c6db29b.woff2) format("woff2");
  //   font-style:normal;
  //   font-weight:400;
  //   font-stretch:condensed;
  //   font-display:swap
  // }
  // @font-face {
  //   font-family:sans-meat;
  //   src:url(/_next/static/media/sansmeat-wide-bold.bc6951bc.woff2) format("woff2");
  //   font-style:normal;
  //   font-weight:700;
  //   font-stretch:expanded;
  //   font-display:swap
  // }
  // @font-face {
  //   font-family:sans-meat;
  //   src:url(/_next/static/media/sansmeat-wide-regular.de2f161d.woff2) format("woff2");
  //   font-style:normal;
  //   font-weight:400;
  //   font-stretch:expanded;
  //   font-display:swap
  // }