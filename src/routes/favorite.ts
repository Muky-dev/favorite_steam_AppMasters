import Router, { Request, Response } from 'express'
import Favorite from '../models/Favorite'

const router = Router()

router.get('/', async (req: Request, res: Response): Promise<void> => {
    const userHash = req.headers['user-hash']
    try {
        const data = await Favorite.find({ userHash: userHash })
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { appid, rating } = req.body
        const userHash = req.headers['user-hash']
        const favoriteInstance = new Favorite({
            appid: appid,
            rating: rating,
            userHash: userHash,
        }).save()

        res.json({ message: 'Favorito criado', data: favoriteInstance })
    } catch (err) {
        res.status(400).json({ error: err })
    }
})

router.delete('/:appid')

export default router
