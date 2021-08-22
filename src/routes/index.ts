import Router, { Request, Response } from 'express'
import cache from 'memory-cache'
import axios, { AxiosResponse } from 'axios'
import { IApplist, IUniqueApp } from '../types/axios'

const router = Router()

router.get('/', async (req: Request, res: Response): Promise<void> => {
    const baseUrl: string =
        'https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json'
    try {
        const cached = cache.get(baseUrl)
        if (cached) {
            res.status(200).json(cached)
        } else {
            const { data }: AxiosResponse<IApplist> = await axios.get(baseUrl)
            const appArray = data.applist.apps.slice(0, 300)
            cache.put(baseUrl, appArray)
            res.status(200).json(appArray)
        }
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const requestApiUrl: string = `https://store.steampowered.com/api/appdetails?appids=${id}`
    try {
        const cached = cache.get(requestApiUrl)
        if (cached) {
            res.status(200).json(cached)
        } else {
            const { data }: AxiosResponse<IUniqueApp> = await axios.get(
                requestApiUrl,
            )
            if (!data[id].success) {
                throw "Can't find this app"
            }
            const dataResponse = data[id].data
            cache.put(requestApiUrl, dataResponse)
            res.status(200).json(dataResponse)
        }
    } catch (err) {
        res.status(400).json({ error: err })
    }
})

export default router
