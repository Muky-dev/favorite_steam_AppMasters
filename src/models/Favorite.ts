import { Schema, model } from 'mongoose'

const FavoriteSchema = new Schema({
    userHash: {
        type: String,
        required: true,
    },
    appid: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
    },
})

export default model('Favorite', FavoriteSchema)
