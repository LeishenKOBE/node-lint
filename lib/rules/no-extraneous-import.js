'use strict'

const checkExtraneous = require('../util/check-extraneous')
const getAllowModules = require('../util/get-allow-modules')
const getConvertPath = require('../util/get-convert-path')
const getResolvePaths = require('../util/get-resolve-paths')
const getTryExtensions = require('../util/get-try-extensions')
const visitImport = require('../util/visit-import')

module.exports = {
  meta: {
    docs: {
      description:
        'disallow `import` declarations which import extraneous modules',
      category: 'Possible Errors',
      recommended: true,
    },
    type: 'problem',
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowModules: getAllowModules.schema,
          convertPath: getConvertPath.schema,
          resolvePaths: getResolvePaths.schema,
          tryExtensions: getTryExtensions.schema,
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const filePath = context.getFilename()
    if (filePath === '<input>') {
      return {}
    }

    return visitImport(context, {}, targets => {
      checkExtraneous(context, filePath, targets)
    })
  },
}