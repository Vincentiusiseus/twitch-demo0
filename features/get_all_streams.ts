// My libs
import { MainDB } from "~/src/db"
import { getAllStreams } from "~/src/twitch-api"
import { getClientId, getOAuthToken } from "~/src/util"

async function main() {
    const key = getClientId()
    const secret = getOAuthToken()

    const all_streams = await getAllStreams(key, secret)

    const inst = new MainDB()
    await inst.init()
    await inst.storeAllStreams(all_streams)

    console.log("get_all_streams: Done")
}

main()