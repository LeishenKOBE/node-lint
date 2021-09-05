# ESLint Plugin 开发过程

每个插件是一个命名格式为 `eslint-plugin-<plugin-name>` 的 npm 模块，比如 `eslint-plugin-jquery`。你也可以用这样的格式 `@<scope>/eslint-plugin-<plugin-name>` 限定在包作用域下，比如 `@jquery/eslint-plugin-jquery`。

## 创建一个插件

创建一个插件最简单的方式是使用 [Yeoman generator](https://www.npmjs.com/package/generator-eslint)。它将引导你完成插件框架的设置。

## 插件里的规则

在 ESLint 中，插件可以暴露额外的规则以供使用。为此，插件必须输出一个 rules 对象，包含规则 ID 和对应规则的一个键值对。这个规则 ID 不需要遵循任何命名规范（所以，比如，它可以是 dollar-sign）。

```js
module.exports = {
  rules: {
    "dollar-sign": {
      create: function (context) {
        // rule implementation ...
      },
    },
  },
};
```

如果要在 ESLint 中使用插件中的规则，你可以使用不带前缀的插件名，后跟一个 /，然后是规则名。所以如果这个插件是 eslint-plugin-myplugin，那么在你的配置中你可以使用 myplugin/dollar-sign 来引用其中的规则。示例："rules": {"myplugin/dollar-sign": "error"}。

## 插件中的环境

插件可以暴露额外的环境以在 ESLint 中使用。为此，插件必须输出一个 environments 对象。environments 对象的 key 是不同环境提供的名字，值是不同环境的设置。例如：

```js
module.exports = {
  environments: {
    jquery: {
      globals: {
        $: false,
      },
    },
  },
};
```

在这个插件中，定义了一个 jquery 环境。为了在 ESLint 中使用这个环境，你可以使用不带前缀的插件名，后跟一个 /，然后是环境名。所以如果这个插件是 eslint-plugin-myplugin，那么在你的配置中设置环境为 myplugin/jquery。

插件环境定义以下对象：

1. globals - 同配置文件中的 globals 一样。key 是全局变量的名字，值为 true 允许全局变量被覆盖，false 不允许覆盖。
2. parserOptions - 同配置文件中的 parserOptions 一样。

## 插件中的处理器

你也可以创建插件告诉 ESLint 如何处理 JavaScript 之外的文件。为了创建一个处理器，从你的模块中输出的对象必须符合以下接口：

```js
module.exports = {
  processors: {
    // assign to the file extension you want (.js, .jsx, .html, etc.)
    ".ext": {
      // takes text of the file and filename
      preprocess: function (text, filename) {
        // here, you can strip out any non-JS content
        // and split into multiple strings to lint

        return [string]; // return an array of strings to lint
      },

      // takes a Message[][] and filename
      postprocess: function (messages, filename) {
        // `messages` argument contains two-dimensional array of Message objects
        // where each top-level array item contains array of lint messages related
        // to the text that was returned in array from preprocess() method

        // you need to return a one-dimensional array of the messages you want to keep
        return messages[0];
      },

      supportsAutofix: true, // (optional, defaults to false)
    },
  },
};
```

preprocess 将文件内容和文件名称作为参数，返回一个要检查的字符串数组。这些字符串将被分别检查，但仍要注册到文件名。决定它需要返回的只是一部分还是多个块，取决于这个插件。例如，在处理.html 文件时，通过合并所有的脚本，你可能想要返回数组中的一项，但是对于.md 文件，每个 JavaScript 块可能是独立的，你可以返回多个项。

postprocess 方法接受一个二维数组，包含检测消息和文件名。输入数组中的每一项都对应从 preprocess 方法返回的部分。preprocess 方法必须调整所有错误的位置，使其与原始的未处理的代码中的位置相对应，并将它们聚合成一个打平的数组并返回。

报告的问题有以下位置信息：

```js
{
    line: number,
    column: number,

    endLine?: number,
    endColumn?: number
}
```

默认情况下，当使用处理器时，ESLint 不会执行自动修复，即使在命令行上启用了 --fix 标志。要允许 ESLint 在使用处理器时自动修复代码，你应该采取以下额外步骤：

1.更新 postprocess 方法，以额外转换报告问题的 fix 属性。所有可自动修复的问题都有一个 fix 属性，它是一个对象，模式如下:

```js
{
    range: [number, number],
    text: string
}
```

range 属性在代码中包含两个索引，表示将被替换的连续文本段的开始和结束位置。text 属性引用将替换给定范围的文本。

在最初的问题列表中，fix 属性将引用处理过的 JavaScript 中的修复。postprocess 方法应该将对象转换为引用原始的未处理的文件中的修复。

2.向处理器添加 supportsAutofix: true 属性。

你可以在一个插件中同时拥有规则和处理器。你也可以一个插件中拥有多个处理器。 要支持多个扩展，请将每一个处理器添加到 processors 元素，然后将它们指向同一个对象。

## 插件中的设置

你可以在一个插件中在 configs 键下指定打包的配置。当你想提供不止代码风格，而且希望提供一些自定义规则来支持它时，会非常有用。每个插件支持多配置。注意不可能为给定的插件指定默认配置，当用户想要使用一个插件时，必须在配置文件中指定。

```js
// eslint-plugin-myPlugin
module.exports = {
    configs: {
        myConfig: {
            plugins: ["myPlugin"],
            env: ["browser"],
            rules: {
                semi: "error",
                "myPlugin/my-rule": "error",
                "eslint-plugin-myPlugin/another-rule": "error"
            }
        },
        myOtherConfig: {
            plugins: ["myPlugin"],
            env: ["node"],
            rules: {
                "myPlugin/my-rule": "off",
                "eslint-plugin-myPlugin/another-rule": "off"
                "eslint-plugin-myPlugin/yet-another-rule": "error"
            }
        }
    }
};
```

如果上面的示例插件名为 eslint-plugin-myPlugin，那么 myConfig 和 myOtherConfig 配置可以分别从 "plugin:myPlugin/myConfig" 和 "plugin:myPlugin/myOtherConfig" 扩展出来。

```js
{
    "extends": ["plugin:myPlugin/myConfig"]
}
```

## 纯净的依赖

为了明确插件需要 ESLint 才能正常运行，你必须在你的 package.json 中声明将 ESLint 作为一个 peerDependency。对插件的支持在 ESLint 0.8.0 版本中被引入。要确保 peerDependency 指向 ESLint 0.8.0 或之后的版本。

```js
{
    "peerDependencies": {
        "eslint": ">=0.8.0"
    }
}
```
