// Node packages
import * as path from "path"
import * as fs from "fs"

// NPM package
import express from "express"

// My libs
import { getClientId } from "~/src/util/index"

const OAUTH_REDIRECT = "https://id.twitch.tv/oauth2/authorize"
const REDIRECT_URI = "http://localhost:8080/auth"
const PORT = 8080

function runAuthServer(client_id:string) {
    const app = express()
    const redirect_url = new URL("", OAUTH_REDIRECT)
    redirect_url.searchParams.append("client_id", client_id)
    redirect_url.searchParams.append("redirect_uri", REDIRECT_URI)
    redirect_url.searchParams.append("response_type", "token")

    app.get("/redirect", async (req, res) => {
        console.log("/redirect: redirect url", redirect_url.href)
        res.redirect(redirect_url.href)
    })

    app.get("/auth", async (req, res) => {
        return res.sendFile(path.join(__dirname, 'index.html'));
    })

    app.get("/save-token", (req, res) => {
        const hash = req.query["hash"] as string
        const sp = new URLSearchParams(hash.slice(1))
        const access_token = sp.get("access_token")
        fs.writeFileSync("cred/access_token.txt", access_token)
        console.log(`/save-token: Saved token`)
    })

    app.listen(PORT, () => {
        console.log(`Running on port ${PORT}`)
    })
}
runAuthServer(getClientId())