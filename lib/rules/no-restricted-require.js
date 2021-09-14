'use strict'

const check = require('../util/check-restricted')
const visit = require('../util/visit-require')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow specified modules when loaded by `require`',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: null,
    schema: [
      {
        type: 'array',
        items: {
          anyOf: [
            {type: 'string'},
            {
              type: 'object',
              properties: {
                name: {
                  anyOf: [
                    {type: 'string'},
                    {
                      type: 'array',
                      items: {type: 'string'},
                      additionalItems: false,
                    },
                  ],
                },
                message: {type: 'string'},
              },
              additionalProperties: false,
              required: ['name'],
            },
          ],
        },
        additionalItems: false,
      },
    ],
    messages: {
      restricted:
        "'{{name}}' module is restricted from being used.{{customMessage}}",
    },
  },

  create(context) {
    const opts = {includeCore: true}
    return visit(context, opts, targets => check(context, targets))
  },
}
