'use strict'

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow `new` operators with calls to `require`',
      category: 'Possible Errors',
      recommended: false,
    },
    fixable: null,
    schema: [],
    messages: {
      noNewRequire: 'Unexpected use of new with require.',
    },
  },

  create(context) {
    return {
      NewExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require'
        ) {
          context.report({
            node,
            messageId: 'noNewRequire',
          })
        }
      },
    }
  },
}
