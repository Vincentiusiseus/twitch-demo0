// NPM libs
import { MongoClient } from "mongodb"

// Types
import type { Db } from "mongodb"

/**
 * 2022-12-30 12:12
 * Hangs then error with `localhost` instead of `127.0.0.1`.
 */
const URL = 'mongodb://127.0.0.1:27017';

export class MainDB {
    client:MongoClient
    db:Db

    constructor() {
        this.client = new MongoClient(URL)
    }

    async storeAllStreams(all_streams:any[]) {
        const stored_at = new Date()
        for(const stream of all_streams) {
            await this.db.collection("streams").insertOne(Object.assign({ stored_at }, stream))
        }
    }

    async init() {
        await this.client.connect();
        this.db = this.client.db("twitch-demo0");
    }
}