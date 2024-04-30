import express from "express"
import path from 'path';
// import {fileURLToPath} from 'url';
import * as fs from "fs";
import avatarScheme from "./avatar.scheme.js";
import userSchema from "./user.schema.js";
import * as uuid from "uuid";
import passport from "passport"
import {BasicStrategy} from "passport-http"
import bcrypt from "bcrypt";

import {isParent, isChild} from "./roles.js";

// const __dirname = ".";
const __dirname = "./src";
export const app = express()

// passport.use(new Strategy(
//     function(token, done) {
//         try {
//             const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf8"))
//             const user = users.find(user => user.token === token)
//             if (user) {
//                 done(null, user)
//             } else {
//                 done(null, false)
//             }
//         }catch (e){
//             done(e)
//         }
//     }
// ));

passport.use(new BasicStrategy(
    async function (userid, password, done) {
        try {
            const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf8"))
            const user = users.find(user => user.userName === userid)
            if (user) {
                const isCorrect = await bcrypt.compare(password, user.password)
                isCorrect ? done(null, user) : done(null, false)
            } else {
                done(null, false)
            }
        } catch (e) {
            done(e)
        }
    }
));



app.use(express.static(`${__dirname}/public/`))
app.use(express.json())
// app.use(passport.authenticate('basic', {session: false}),)
app.get('/', function (req, res) {
    res.sendFile(`index.html`)
})

app.post('/api/avatars', passport.authenticate('basic', {session: false}), isParent,(req, res) => {
    console.log(" POST /api/avatars")
    let newAvatar = req.body


    const {error, value} = avatarScheme.validate(newAvatar)

    if (error) {
        res.status(400).send(error)
        return
    }


    newAvatar = {
        id: uuid.v4(),
        avatarName: newAvatar.avatarName,
        childAge: newAvatar.childAge,
        skinColor: newAvatar.skinColor,
        hairstyle: newAvatar.hairstyle,
        headShape: newAvatar.headShape,
        upperClothing: newAvatar.upperClothing,
        lowerClothing: newAvatar.lowerClothing,
        createdAt: new Date(Date.now()).toISOString()
    }


    try {

        const obj = JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`, "utf8"))

        fs.writeFileSync(`${__dirname}/avatars.json`, JSON.stringify([...obj, newAvatar]))
        res.status(201).set("Location", `/api/avatars/${newAvatar.id}`).send(newAvatar)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

app.get("/api/avatars", passport.authenticate('basic', {session: false}), isChild,  (req, res) => {
    console.log(" GET /api/avatars")
    const avatarsArray = JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`, "utf8"))
    res.send(avatarsArray)
})

app.get("/api/avatars/:id", passport.authenticate('basic', {session: false}), isChild,(req, res) => {
    const avatarID = req.params.id
    console.log(` GET /api/avatars/:${avatarID}`)
    const avatarsArray = JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`, "utf8"))
    const avatar = avatarsArray.find((av) => av.id === avatarID)
    if (!avatar)
        res.sendStatus(404)
    else
        res.send(avatar)
})

app.put("/api/avatars/:id", passport.authenticate('basic', {session: false}),  isParent,(req, res) => {
    const avatarID = req.params.id
    const updateParams = req.body
    console.log(` PUT /api/avatars/:${avatarID}`)
    const avatarsArray = JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`, "utf8"))
    const avatar = avatarsArray.find((av) => av.id === avatarID)

    const {error, value} = avatarScheme.validate(req.body, {abortEarly: false});

    if (error) {
        res.status(400).send(error)
        return
    }

    if (!avatar)
        res.sendStatus(404)
    else {
        avatarsArray[avatarsArray.indexOf(avatar)] = {...avatar, ...updateParams}
        fs.writeFileSync(`${__dirname}/avatars.json`, JSON.stringify(avatarsArray), (err) => {
            if (err) {
                console.log("ERROR")
            }
        })
        res.sendStatus(204)
    }

})

app.delete("/api/avatars/:id", passport.authenticate('basic', {session: false}), isParent,(req, res) => {
    const avatarID = req.params.id
    console.log(` DELETE /api/avatars/:${avatarID}`)
    const avatarsArray = JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`, "utf8"))
    const avatar = avatarsArray.findIndex((av) => av.id === avatarID)
    if (avatar === -1)
        res.sendStatus(404)
    else {
        avatarsArray.splice(avatar, 1)
        fs.writeFileSync(`${__dirname}/avatars.json`, JSON.stringify(avatarsArray), (err) => {
            if (err) {
                console.log("ERROR")
            }
        })
        res.sendStatus(204)
    }
})

app.post("/api/users", async (req, res) => {
    const {error, value} = userSchema.validate(req.body)
    if (error) {
        res.sendStatus(400)
        return
    }

    const newUser = {
        ...req.body,
        password: await bcrypt.hash(req.body.password, 10),
        roles: ["parent"]
    }

    const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf8"))
    try {
        fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify([...users, newUser]))
        res.sendStatus(201)
    } catch (e) {
        res.sendStatus(500)
    }


})


export default app