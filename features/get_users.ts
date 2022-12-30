// NPM libs
import axios from "axios"

// My libs
import { MainDB } from "~/src/db"
// import { getAllStreams } from "~/src/twitch-api"
import { getClientId, getOAuthToken } from "~/src/util"

const URL_BASE = "https://api.twitch.tv/helix/users"

async function getUserWithLogin(client_id:string, access_token:string, login:string) {
    const url = new URL("", URL_BASE)
    url.searchParams.append("login", login)
    const url_str = url.href
    const response = await axios.get(url_str, { headers: { "Authorization": `Bearer ${access_token}`, "Client-Id": client_id } })
    return response
}

async function main() {
    const client_id = getClientId()
    const access_token = getOAuthToken()

    // Vincentiusiseus: 858224483
    const response = await getUserWithLogin(client_id, access_token, "vincentiusiseus")
    const user = response.data
    console.log(user)
}
main()