import Router, { Request, Response } from 'express'
import axios, { AxiosResponse } from 'axios'

import Favorite from '../models/Favorite'
import { IUniqueApp } from '../types/axios'
import { IFavorite } from '../types/favorite'

const router = Router()

// Get all favorites from user
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const user = req.user
    try {
        const favoriteArray: IFavorite[] = await Favorite.find({
            userHash: user,
        })

        if (favoriteArray.length == 0) {
            throw "This user don't have favorites"
        }

        res.status(200).json(favoriteArray)
    } catch (err) {
        res.status(400).json({ error: err })
    }
})

// Create new favorite
router.post('/:appid', async (req: Request, res: Response): Promise<void> => {
    const { rating } = req.body
    const { appid } = req.params
    const user = req.user

    const requestApiUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}`
    try {
        const { data }: AxiosResponse<IUniqueApp> = await axios.get(
            requestApiUrl,
        )
        // verify if the app exists and if successfully had a response
        if (!data[appid].success || !appid) {
            throw 'Please insert a valid appid'
        }

        const parsedRating = parseInt(rating)
        if (parsedRating > 5 || parsedRating < 0) {
            throw 'Please provide a rating between 0 and 5'
        }
        const parsedAppId = parseInt(appid)

        const favoriteExists: IFavorite | null = await Favorite.findOne({
            appid: parsedAppId,
            userHash: user,
        })

        if (favoriteExists) {
            throw 'This favorite already exists'
        }

        const favoriteInstance: IFavorite = await Favorite.create({
            appid: appid,
            userHash: user,
            rating: parsedRating,
            data: data[appid].data,
        })

        res.json({
            message: 'Favorite created',
            data: {
                appid: favoriteInstance.appid,
                rating: favoriteInstance.rating,
                user: user,
            },
        })
    } catch (err) {
        res.status(400).json({ error: err })
    }
})

// Delete favorite by "appid"
router.delete('/:appid', async (req: Request, res: Response): Promise<void> => {
    const { appid } = req.params
    const user = req.user
    try {
        const parsedAppId = parseInt(appid)
        const favoriteExists = await Favorite.findOne({
            userHash: user,
            appid: parsedAppId,
        })
        if (!favoriteExists) {
            throw "this favorite doesn't exist"
        }
        await favoriteExists.delete()
        res.status(200).json({ message: 'Favorite deleted' })
    } catch (err) {
        res.status(400).json({ error: err })
    }
})

export default router
