#!/usr/bin/env node
import 'source-map-support/register'

import packagesJson from '../package.json' assert { type: 'json' }
import { log } from './utils/console'
import chalk from 'chalk'
import fs from 'fs'

const argv = process.argv.slice(2)
const prefixArgv = argv[0]

switch (prefixArgv) {
    case 'version': {
        log('assetbox version', chalk.green(packagesJson.version))
        break
    }
    case 'init': {
        fs.writeFile(
            '../config.js',
            '//please input your own information.',
            (err) => {
                if (err) console.log('Error: ', err)
                else console.log('config.js file is created.')
            }
        )
        break
    }
}
