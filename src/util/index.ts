import * as fs from "fs"

export function getClientId() {
    return fs.readFileSync("./cred/api.txt", "utf-8").split("\n")[0].trim()
}

export function getClientSecret() {
    return fs.readFileSync("./cred/api.txt", "utf-8").split("\n")[1].trim()
}

export function getOAuthToken() {
    return fs.readFileSync("./cred/access_token.txt", "utf-8").trim()
}