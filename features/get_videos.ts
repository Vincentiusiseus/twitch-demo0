/**
 * 2022-12-30 13:47
 * 한국 IP로 보내는 request는 empty list로옴. Error status도 아님.
 * Cloud VM 지역을 외국으로 설정후 거기서 다운받아야할듯.
 * 
 * `created_at`: 방송 시작 시간
 */

// NPM libs
import axios from "axios"

// My libs
import { MainDB } from "~/src/db"
// import { getAllStreams } from "~/src/twitch-api"
import { getClientId, getOAuthToken } from "~/src/util"

const URL_BASE = "https://api.twitch.tv/helix/videos"

async function getVideos(client_id:string, access_token:string, user_id:string) {
    const url = new URL("", URL_BASE)
    // https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
    // url.searchParams.append("user_id", user_id)
    url.searchParams.append("id", "39959961207")
    const url_str = url.href
    const response = await axios.get(url_str, { headers: { "Authorization": `Bearer ${access_token}`, "Client-Id": client_id } })
    return response
}

async function main() {
    const client_id = getClientId()
    const access_token = getOAuthToken()

    // Vincentiusiseus: 858224483
    const videos = await getVideos(client_id, access_token, "137952746")

    // const inst = new MainDB()
    // await inst.init()
    // await inst.storeAllStreams(all_streams)

    console.log(videos)

    console.log("get_videos/main: Done")
    
    // await inst.client.close()
}

main()