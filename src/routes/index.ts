import Router, { Request, Response } from 'express'
import axios, { AxiosResponse } from 'axios'
import { IApplist, IUniqueApp } from '../types/axios'

const router = Router()

router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { data }: AxiosResponse<IApplist> = await axios.get(
            'https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json',
        )
        const appArray = data.applist.apps.slice(0, 10)
        res.status(200).json(appArray)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const requestApiUrl: string = `https://store.steampowered.com/api/appdetails?appids=${id}`
        const { data }: AxiosResponse<IUniqueApp> = await axios.get(
            requestApiUrl,
        )
        if (!data[id].success) {
            throw "Can't find this app"
        }
        res.status(200).json(data[id].data)
    } catch (err) {
        res.status(400).json({ error: err })
    }
})

export default router
