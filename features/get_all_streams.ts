// My libs
import { MainDB } from "~/src/db"
import { getAllStreams } from "~/src/twitch-api"
import { getClientId, getOAuthToken } from "~/src/util"

async function main() {
    const client_id = getClientId()
    const access_token = getOAuthToken()

    const all_streams = await getAllStreams(client_id, access_token)

    const inst = new MainDB()
    await inst.init()
    await inst.storeAllStreams(all_streams)

    console.log("get_all_streams: Done")
    await inst.client.close()
}

main()