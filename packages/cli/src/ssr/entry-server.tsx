import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { App } from '@assetbox/manager'

export const render = (url: string) => {
    return ReactDOMServer.renderToString(
        <StaticRouter location={url}>
            <App />
        </StaticRouter>
    )
}