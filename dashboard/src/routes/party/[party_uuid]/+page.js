import {getApi_url} from "../../../helpers/variables"
import { error } from '@sveltejs/kit';

export const prerender = 'auto'

   /** @type {import('./$types').PageLoad} */
    export function load({ params }) {    	// import { page } from '$app/stores';

        return fetch(`${getApi_url()}/party/${params.party_uuid}`).catch(error => console.log(error)).then(ret => {
            if(ret.status!=200){
                throw error(404, "Not found");
            }
            else{
                return ret.json()
            }
        } ).then(data => data)
    }
