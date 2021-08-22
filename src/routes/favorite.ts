import Router, { Request, Response } from 'express'
import cache from 'memory-cache'
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
        const favoriteWithData = await Promise.all(
            favoriteArray.map(async (elem) => {
                const data = cache.get(elem.appid)
                let favoriteWithData = {
                    appid: elem.appid,
                    userHash: elem.userHash,
                    rating: elem.rating,
                    data: data,
                }
                if (!data) {
                    const { data }: AxiosResponse<IUniqueApp> = await axios.get(
                        `https://store.steampowered.com/api/appdetails?appids=${elem.appid}`,
                    )
                    cache.put(elem.appid, data[elem.appid].data)
                    favoriteWithData.data = data[elem.appid].data
                }
                return favoriteWithData
            }),
        )

        res.status(200).json(favoriteWithData)
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
        const parsedAppId = parseInt(appid)
        const favoriteExists: IFavorite | null = await Favorite.findOne({
            appid: parsedAppId,
            userHash: user,
        })

        if (favoriteExists) {
            throw 'This favorite already exists'
        }

        const dataExists = cache.get(appid)

        if (!dataExists) {
            const { data }: AxiosResponse<IUniqueApp> = await axios.get(
                requestApiUrl,
            )
            // verify if the app exists and if successfully had a response
            if (!data[appid].success || !appid) {
                throw 'Please provide a valid appid in url params'
            }
            cache.put(appid, data[appid].data)
        }

        let parsedRating
        if (rating) {
            parsedRating = parseInt(rating)
            if (parsedRating > 5 || parsedRating < 0) {
                throw 'Please provide a rating between 0 and 5'
            }
        }

        const favoriteInstance: IFavorite = await Favorite.create({
            appid: parsedAppId,
            userHash: user,
            rating: parsedRating,
        })

        res.json({
            message: 'Favorite created',
            content: {
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
