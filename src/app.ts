import express, { Express } from 'express'
import mongoose from 'mongoose'
import rateLimit, { RateLimit } from 'express-rate-limit'
import cors from 'cors'

import favoriteRoutes from './routes/favorite'
import rootRoutes from './routes/index'

const app: Express = express()

const PORT: string | number = process.env.PORT || 4000

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 200,
})

app.use(cors())
app.use(express.urlencoded({ limit: '20mb', extended: false }))
app.use(express.json())
app.use(limiter)

// Favorite routes with user-hash verify middleware
app.use(
    '/favorite',
    (req, res, next) => {
        const userHash = req.headers['user-hash']

        if (userHash && !Array.isArray(userHash)) {
            req.user = userHash
            next()
        } else {
            res.status(400).json({
                message: 'Please provide a valid "user-hash" in request header',
            })
        }
    },
    favoriteRoutes,
)

app.use('/', rootRoutes)

//404 Handler
app.use('*', (req, res, next) => {
    res.status(404).json({ message: 'Not found' })
})

const mongoURI: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vabk6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

const db = mongoose.connection

db.on('error', (error) => console.log(error))
db.once('open', () => {
    console.log('Database connected')
})

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})
