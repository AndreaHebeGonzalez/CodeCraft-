import useAppStore from "../stores/useAppStore"


export const initBreakpoints = () => {
  
  const update = () => { 
    const width = window.innerWidth
    useAppStore.setState({
      isMobile: width >= 480,
      isTablet: width >= 768,
      isTabletTwo: width >= 992,
    })
  }

  update()
  window.addEventListener("resize", update)

  return () => window.removeEventListener("resize", update)
}