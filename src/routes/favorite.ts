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
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { appid, rating } = req.body
    const user = req.user
    try {
        const { data }: AxiosResponse<IUniqueApp> = await axios.get(
            `https://store.steampowered.com/api/appdetails?appids=${appid}`,
        )
        if (!data[appid].success) {
            throw 'Please insert a valid appid'
        }

        const favoriteInstance: IFavorite = await Favorite.create({
            appid: appid,
            userHash: user,
            rating: rating,
            data: data[appid].data,
        })

        res.json({
            message: 'Favorite created',
            data: { appid: favoriteInstance.appid, rating: rating },
        })
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

// Delete favorite by "appid"
router.delete('/:appid', async (req: Request, res: Response): Promise<void> => {
    const { appid } = req.params
    const user = req.user
    try {
        const parsedAppId = parseInt(appid)
        await Favorite.findOneAndDelete({
            userHash: user,
            appid: parsedAppId,
        })
        res.status(200).json({ message: 'Favorite deleted' })
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

export default router
