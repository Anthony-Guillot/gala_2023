import { env } from '$env/dynamic/public';
import { browser } from '$app/environment'; 


const getApi_url = () => {
    if(!browser){
        return env.PUBLIC_API_URL
    }else{
        console.log("env ", env)
        return env.PUBLIC_ENV == 'developpement' ? 'http://localhost:3000' : env.PUBLIC_API_URL
    }
}


export {getApi_url}