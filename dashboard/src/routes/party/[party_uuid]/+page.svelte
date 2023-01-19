<script>
    import { page } from "$app/stores";

    import { error, json } from "@sveltejs/kit";
    import { getApi_url } from "../../../helpers/variables";

    export let data;

    let participants = fetch(`${getApi_url()}/consumer?party_uuid=${$page.params.party_uuid}`, {
    })
        .catch((err) => console.log(err))
        .then((data) => {
            if (data.status != 200) {
                console.log("Quelque chose s'est mal passé : ", data);
            } else {
                return data.json().then((res) => {console.log(res) ;return res });
            }
        });

        let consumables = fetch(`${getApi_url()}/consumable?party_uuid=${$page.params.party_uuid}`, {
    })
        .catch((err) => console.log(err))
        .then((data) => {
            if (data.status != 200) {
                console.log("Quelque chose s'est mal passé : ", data);
            } else {
                return data.json().then((res) => {console.log(res) ;return res });
            }
        });


</script>

<h1>{data.name}</h1>
<h2>{data.description}</h2>

<h2>Participants :</h2>
{#await participants}
{:then participants}
{#each participants as participant}
    <li>{participant.uuid} : {participant.name}</li>
{/each}
{/await}


<h2>Consommables :</h2>
{#await consumables}
{:then consumables}
{#each consumables as consumable}
    <li>{consumable.name} : {consumable.description}</li>
{/each}
{/await}

