// Node libs
import * as fs from "fs"

// NPM libs
import axios from "axios"

// Types
import type { AxiosResponse } from "axios"

const URL_BASE = "https://api.twitch.tv/helix/streams"

class GetAllStreams {
    all_streams:Array<any>
    stream_id_count_map:any

    // States
    cursor:string
    response:AxiosResponse
    res_data:any
    rate_limit:any
    count_map_lenth_before:number
    count_map_same_lenth_count:number

    constructor(
        public client_id:string,
        public access_token:string
    ) {
        this.all_streams = []
        this.stream_id_count_map = {}

        // States
        this.cursor = ""
        this.response = null
        this.res_data = {}
        this.rate_limit = {}
        this.count_map_lenth_before = 0
        this.count_map_same_lenth_count = 0
    }

    async initReq() {
        const url = new URL("", URL_BASE)
        // https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
        let iso_639_1 = "ko"
        url.searchParams.append("language", iso_639_1)
        url.searchParams.append("first", "100")
        const url_str = url.href
        const response = await axios.get(url_str, { headers: { "Authorization": `Bearer ${this.access_token}`, "Client-Id": this.client_id } })
        this.response = response
        this.res_data = this.response.data
        this.cursor = this.res_data.pagination.cursor
    }

    async contReq() {
        const url = new URL("", URL_BASE)
        let iso_639_1 = "ko"
        url.searchParams.append("language", iso_639_1)
        url.searchParams.append("after", this.cursor)
        url.searchParams.append("first", "100")
        const url_str = url.href
        const response = await axios.get(url_str, { headers: { "Authorization": `Bearer ${this.access_token}`, "Client-Id": this.client_id } })
        const data = response.data
        this.res_data = data
        this.cursor = this.res_data.pagination.cursor
    }

    processResData() {
        console.log("processResData:")
        // https://dev.twitch.tv/docs/api/guide#twitch-rate-limits
        for(const key of ["limit", "remaining", "reset"]) {
            this.rate_limit[key] = this.response.headers[`ratelimit-${key}`]
        }
        console.log(this.rate_limit)
        const streams = this.res_data.data
        this.all_streams = this.all_streams.concat(streams)

        for(const stream of streams) {
            const stream_id = stream.id  // Becomes VOD's id
            const user_id = stream.user_id
            const user_login = stream.user_login
            const user_name = stream.user_name
            const viewer_count = stream.viewer_count
            const started_at = stream.started_at
            const tag_ids = stream.tag_ids
            const tags = stream.tags

            this.stream_id_count_map[stream_id] = stream_id in this.stream_id_count_map ? this.stream_id_count_map[stream_id] + 1 : 1
        }

        if(Object.keys(this.stream_id_count_map).length == this.count_map_lenth_before) {
            this.count_map_same_lenth_count++
        }
        else {
            this.count_map_same_lenth_count = 0
        }

        this.count_map_lenth_before = Object.keys(this.stream_id_count_map).length
    }

    async start() {
        await this.initReq()
        this.processResData()
        while(true) {
            await this.contReq()
            if(this.cursor == undefined) {
                break
            }

            this.processResData()

            console.log("this.all_streams.length", this.all_streams.length)
            console.log("this.count_map_same_lenth_count", this.count_map_same_lenth_count)
            if(this.count_map_same_lenth_count >= 2) {
                console.log("Done")
                break
            }
        }
        console.log(this.stream_id_count_map)
        console.log(Object.keys(this.stream_id_count_map).length)

        fs.writeFileSync("data/all_streams.json", JSON.stringify(this.all_streams, null, 2))
    }
}

export async function getAllStreams(client_id:string, access_token:string) {
    const inst = new GetAllStreams(client_id, access_token)
    return await inst.start()
}