import { Document } from 'mongoose'

export interface IFavorite extends Document {
    userHash: string
    appid: number
    rating: number
    data: object
}
