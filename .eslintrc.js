module.exports = {
	"env": {
		"browser": true,
		"node": true,
		"es6": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 2015,
		"sourceType": "module"
	},
	"rules": {
		"no-console": "off",
		"no-extra-boolean-cast": 1,
		"no-extra-semi": 1,
		"no-extra-parens": 1, //多余的括号
		"no-empty": 1, //空代码块
		"no-use-before-define": [1, "nofunc"], //使用前未定义
		"complexity": [1, 10], //圈复杂度大于10 警告
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"off",
			"windows"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"warn",
			"never"
		],
		//代码风格优化
		"no-else-return": 1, //在else代码块中return，else是多余的
		"no-multi-spaces": 1, //不允许多个空格
		"key-spacing": [1, {"beforeColon": false,"afterColon": true}],//object直接量建议写法 : 后一个空格前面不留空格
		"block-scoped-var": 2, //变量应在外部上下文中声明，不应在{}代码块中
		"consistent-return": 2, //函数返回值可能是不同类型
		"accessor-pairs": 2, //object getter/setter方法需要成对出现
		"dot-location": [2, "property"], //换行调用对象方法  点操作符应写在行首
		"no-lone-blocks": 2, //多余的{}嵌套
		"no-extend-native": 2, //禁止扩展原生对象
		"no-floating-decimal": 2, //浮点型需要写全 禁止.1 或 2.写法
		"no-loop-func": 2, //禁止在循环体中定义函数
		"no-new-func": 2, //禁止new Function(...) 写法
		"no-self-compare": 2, //不允与自己比较作为条件
		"no-sequences": 2, //禁止可能导致结果不明确的逗号操作符
		"no-throw-literal": 2, //禁止抛出一个直接量 应是Error对象
		"no-return-assign": [2, "always"], //不允return时有赋值操作
		"no-redeclare": [2, {"builtinGlobals": true}],//不允许重复声明
		"no-unused-expressions": [2, {"allowShortCircuit": true, "allowTernary": true}],//不执行的表达式
		"no-useless-call": 2, //无意义的函数call或apply
		"no-useless-concat": 2, //无意义的string concat
		"no-void": 2, //禁用void
		"no-with": 2, //禁用with
		"space-infix-ops": 2, //操作符前后空格
		"valid-jsdoc": [2, {"requireParamDescription": true,"requireReturnDescription": true}],//jsdoc
		"no-warning-comments": [2, { "terms": ["todo", "fixme", "any other term"],"location": "anywhere" }],//标记未写注释
		"curly": 1 //if、else、while、for代码块用{}包围
	}
}