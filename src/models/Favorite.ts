import { Schema, model } from 'mongoose'
import { IFavorite } from '../types/favorite'

const FavoriteSchema: Schema = new Schema({
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
    data: {
        type: Object,
    },
})

export default model<IFavorite>('Favorite', FavoriteSchema)
