import * as fs from "fs"

export function getClientKey() {
    console.log(fs.readFileSync("./api.txt", "utf-8").split("\n")[0].trim())
}

export function getClientSecret() {
    console.log(fs.readFileSync("./api.txt", "utf-8").split("\n")[1].trim())
}