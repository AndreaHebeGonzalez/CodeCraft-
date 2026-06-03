import { Oval } from "react-loader-spinner";
import './loading.scss'

export const Loading = () => {
  return (
    <div className='loading'>
      <Oval
        visible={true}
        height="60"
        width="60"
        color="#7258D4"
        secondaryColor="#3e2f74"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  )
}
