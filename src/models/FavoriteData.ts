import { Schema, model } from 'mongoose'

const FavoriteDataSchema: Schema = new Schema({
    appid: {
        type: Number,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
})

export default model('FavoriteData', FavoriteDataSchema)
