import fs from 'fs/promises'
import prompts from 'prompts'
import { text } from 'stream/consumers'
import { findAssetPath } from './findAssetPath'
import wst from 'workspace-tools'

export const initialize = async () => {
    var assetPath = ''
    const response = await prompts({
        type: 'toggle',
        name: 'ans',
        message: 'Set assetPath to the default.',
        initial: true,
        active: 'yes',
        inactive: 'no',
    })
    if (response.ans === true) {
        assetPath = './src/assets/**/*'
    } else {
        await prompts({
            type: 'confirm',
            name: 'ans',
            message: 'Please write assetbox.config.json yourself.',
            initial: true,
        })
    }
    await fs.writeFile(
        `${wst.findPackageRoot(__dirname)}/assetbox.config.json`,
        JSON.stringify({ assetPaths: [assetPath] }, null, 2)
    )

    console.log(await findAssetPath())
}
