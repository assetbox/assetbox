import fs from 'fs/promises'
import { config } from 'process'
import glob from 'glob'
export const checkAsset = async () => {
    const assetExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'gif']
    const result = []
    let data = await fs.readFile('./assetbox.config.json')
    let json = JSON.parse(data.toString())
    const fileList = await glob(json.path)
    await fileList.forEach((data) => {
        const fileExtension = data.split('.').pop().toLowerCase()
        if (assetExtensions.indexOf(fileExtension) != -1) {
            result.push(data)
        }
    })
    return result
}
