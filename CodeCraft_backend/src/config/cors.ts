import { CorsOptions } from "cors";

console.log(process.env.FRONTEND_URL)

const corsConfig : CorsOptions = {
  origin: function(origin, callback) { 
    console.log(origin) 
    const whiteList = [process.env.FRONTEND_URL]
    if(!origin || whiteList.includes(origin)) {
      callback(null, true) 
    } else { 
      callback(new Error('Error de CORS'), false)
    }
  } 
}

export default corsConfig