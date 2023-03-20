import fs from 'fs/promises'
import prt from 'prompts'
import { checkAsset } from './checkAsset'

export const initialize = async () => {
    const response = await prt({
        type: 'text',
        name: 'path',
        message: 'Where is the standard directory?',
    })
    console.log('response:' + response.path)
    if (response.path.length === 0) {
        response.path = './src/assets/**/*'
    }
    await fs.writeFile(
        './assetbox.config.json',
        `{\n\t"path":"${response.path}"\n}`
    )
    console.log(await checkAsset())
}
