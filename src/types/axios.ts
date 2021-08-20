export interface IApplist {
    applist: {
        apps: [
            {
                appid: number
                name: string
            },
        ]
    }
}

export interface IUniqueApp {
    [id: string]: {
        success: boolean
        data: object
    }
}
