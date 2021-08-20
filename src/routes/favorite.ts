import Router, { Request, Response } from 'express'

const router = Router()

router.get('/favorite')

router.post('/favorite', async (req: Request, res: Response): Promise<void> => {
    try {
        const { appid, rating } = req.body
    } catch (err) {
        res.status(400).json({ error: err })
    }
})

router.delete('/favorite/:appid')

export default router
