#!/usr/bin/env node
import 'source-map-support/register'
import packagesJson from '../package.json' assert { type: 'json' }
import { log } from './utils/console'
import chalk from 'chalk'

import { initialize } from './initialize'
import { checkAsset } from './checkAsset'
const argv = process.argv.slice(2)
const prefixArgv = argv[0]

switch (prefixArgv) {
    case 'version': {
        log('assetbox version', chalk.green(packagesJson.version))
        break
    }
    case 'init': {
        initialize()

        break
    }
    //   case 'run':{
    //     fs.stat('./config.js').catch( (err) =>console.error(err,"\ninit을 통해 config.js파일을 먼저 생성해주세요."));
    //     Object.values({dirList}.dirList).map((item)=>{
    //      fs.readdir(item).then((data)=>{
    //       const filterList = Object.values(data).filter( (file)=>{
    //         const fileExtension= file.split('.').pop().toLowerCase();
    //         return Object.values({extensions}.extensions).indexOf(fileExtension)!=-1
    //       });
    //       console.log(filterList);

    //      })
    //      .catch((err)=>console.error(err));
    //   })
    // }
}
