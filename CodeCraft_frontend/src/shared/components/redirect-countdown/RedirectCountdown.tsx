import { useEffect, useState } from "react"
import { Oval } from "react-loader-spinner";
import './redirect-countdown.scss'

type RedirectCountdownProps = {
  onComplete:  () => void
}


const RedirectCountdown = ({ onComplete } : RedirectCountdownProps) => {

  const [seconds, setSeconds] = useState(3)

useEffect(() => {
  const intervalId = setInterval(() => {
    setSeconds(prev => {
      if (prev <= 1) {
        clearInterval(intervalId)
        onComplete()
        return 0
      }
      return prev - 1
    })
  }, 1000)

  return () => clearInterval(intervalId)
}, [])

  return (
    <div className="redirect-countdown">
      <Oval
        visible={true}
        height="20"
        width="20"
        color="#7258D4"
        secondaryColor="#3e2f74"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
      <div className="redirect-countdown__message">
        <p>Redireccionando en <span className="redirect-countdown--accent">{seconds} {' '}</span>segundos</p>
      </div>
    </div>
  )
}

export default RedirectCountdown