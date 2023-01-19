<script>
import {getApi_url} from '../helpers/variables'
import { goto } from '$app/navigation';

let party_uuid;
let party_name;

function accessParty(){
    fetch(`${getApi_url()}/party/${party_uuid}`)
    .then((response) => {
        if(response.status === 200){
            goto(`/party/${party_uuid}`)
        }
        else{console.log("err : ", response)}
    });
}

function createParty(){
    console.log("creating party")
}

</script>

<h1>Go to a party {getApi_url()}</h1>
<form on:submit|preventDefault={accessParty}>
    <label for="party_uuid">UUID</label>
    <input bind:value={party_uuid} name="party_uuid" type="text" required>
    <input type="submit" value="GO" />
</form>
<h1>...or create one</h1>
<form on:submit|preventDefault={createParty}>
<label for="party_name">Name</label>
<input input bind:value={party_name} name="party_name" type="text" required>
<input type="submit" value="CREATE" />
</form>