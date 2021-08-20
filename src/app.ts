import express, { Express } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import router from './routes'

const app: Express = express()

const PORT: string | number = process.env.PORT || 4000

app.use(cors())
app.use(express.urlencoded({ limit: '20mb', extended: false }))
app.use(express.json())
app.use(router)

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