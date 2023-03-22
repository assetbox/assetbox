import fs from 'fs/promises'
import { config } from 'process'
import { ASSET_EXTENSIONS } from './common/const'
import glob from 'glob'
export const findAssetPath = async () => {
    const assetExtensions = ASSET_EXTENSIONS
    const data = await fs.readFile('./assetbox.config.json')
    const json = JSON.parse(data.toString())
    const fileList = await Promise.all(
        json.assetPaths.map((assetPath) => glob(assetPath))
    )
    const result = fileList.flat().filter((file) => {
        const fileExtension = file.split('.').pop().toLowerCase()
        return ASSET_EXTENSIONS.includes(fileExtension)
    })
    return result
}
