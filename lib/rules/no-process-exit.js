'use strict'

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the use of `process.exit()`',
      category: 'Possible Errors',
      recommended: false,
    },
    fixable: null,
    schema: [],
    messages: {
      noProcessExit: "Don't use process.exit(); throw an error instead.",
    },
  },

  create(context) {
    return {
      "CallExpression > MemberExpression.callee[object.name = 'process'][property.name = 'exit']"(
        node
      ) {
        context.report({
          node: node.parent,
          messageId: 'noProcessExit',
        })
      },
    }
  },
}