import { createServer as createViteServer } from 'vite'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { render } from '../ssr/entry-server'

export const createServer = async () => {
    const app = express()
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
    })

    app.use(vite.middlewares)
    app.use('*', async (req, res, next) => {
        const url = req.originalUrl

        try {
            let template = fs.readFileSync(
                path.resolve(__dirname, '../index.html'),
                'utf-8'
            )
            template = await vite.transformIndexHtml(url, template)
            const appHtml = await render(url)

            const html = template.replace(`<!--ssr-outlet-->`, appHtml)

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            vite.ssrFixStacktrace(e as any)
            next(e)
        }
    })

    app.listen(5173)
}
