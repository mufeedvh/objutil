// rollup.config.js

import path from 'path'
import fs from 'fs'

var argv = process.argv

// pass args from rollup:
// rollup -c --api assign,pick
// you can add npm scripts:
// scripts: {
//   "objutil": "rollup -c ./node_modules/objutil/rollup.config.js --api 'assign'"
// }
var vars = 'is, own, isIterable, isPrimitive, deepIt, get, invert, assign, assign as extend, merge, exclude, pick, defaults'
var pos = argv.indexOf('--api')
if(pos>0 && argv[pos+1]) vars = argv[pos+1]

var entry = path.join(__dirname, './src/objutil.js')
var exportStr = '\nexport { '+ vars +' }'

// console.log(exportStr)

export default {
  entry: entry,
  plugins: [
    objTransform()
  ],
  moduleName: 'objutil',
  moduleId: 'objutil',
  legacy: true,
  targets: [
    { format: 'iife', dest: path.join(__dirname, 'dist/objutil.iife.js') },
    { format: 'amd',  dest: path.join(__dirname, 'dist/objutil.amd.js')  },
    { format: 'cjs',  dest: path.join(__dirname, 'dist/objutil.cjs.js')  },
    { format: 'es',   dest: path.join(__dirname, 'dist/objutil.es.js')   }
  ]
}

function objTransform () {
  return {
    transform: function(code) {
      return code + exportStr
    },
    // since rollup 0.36.3, legacy:true is supported
    // below line should removed
    transformBundle: function (code, option) {
      // should only check amd,umd,cjs
      // https://github.com/futurist/rollup-plugin-es3
      return  code.replace(/^\s*Object\.defineProperty\(exports,\s*'__esModule'.*\n$/mi, '')
    }
  }
}
