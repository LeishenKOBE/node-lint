'use strict'

const checkExistence = require('../util/check-existence')
const getAllowModules = require('../util/get-allow-modules')
const getResolvePaths = require('../util/get-resolve-paths')
const getTryExtensions = require('../util/get-try-extensions')
const visitRequire = require('../util/visit-require')

module.exports = {
  meta: {
    docs: {
      description:
        'disallow `require()` expressions which import non-existence modules',
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
          tryExtensions: getTryExtensions.schema,
          resolvePaths: getResolvePaths.schema,
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

    return visitRequire(context, {}, targets => {
      checkExistence(context, targets)
    })
  },
}