import express from 'express'
import cors from 'cors' //allow us to control who can talk to our DB
import cookieParser from 'cookie-parser'        //to handle cookies

const app = express()


app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

//common middleware
app.use(express.json({limit: "16kb"})) //this also provides security while accessing DB
app.use(express.urlencoded({extended: true, limit: "16kb"}))   //this also provides security while accessing DB
app.use(express.static('public'))   //used to serve images and stuff
app.use(cookieParser())     //middleware which makes cookies accessible for use


//import routes
import healthCheckRouter from "./routes/healthCheck.routes.js"
import userRouter from "./routes/user.route.js"
import { errorHandler } from './middlewares/error.middlewares.js'
import tweetRouter from "./routes/tweet.route.js"
import videoRouter from "./routes/video.route.js"
import commentRouter from "./routes/comment.route.js"
import likeRouter from "./routes/like.route.js"
import playlistRouter from "./routes/playlist.route.js"
import subscriptionRouter from "./routes/subscription.route.js"

//routes
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/subscription", subscriptionRouter)

app.use(errorHandler)

export { app }