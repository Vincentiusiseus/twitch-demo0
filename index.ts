import { getAllStreams } from "./src/twitch-api"
import { getClientId, getOAuthToken } from "./src/util"

async function main() {
    const key = getClientId()
    const secret = getOAuthToken()

    await getAllStreams(key, secret)
}

main()