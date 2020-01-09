## TypeScript
>TypeScript 是 JavaScript 的类型的超集，它可以编译成纯 JavaScript。编译出来的 JavaScript 可以运行在任何浏览器上。TypeScript 编译工具可以运行在任何服务器和任何系统上。TypeScript 是开源的。
### TypeScript的优势
1. 严格的类型系统，为 JavaScript 薄弱的类型检查保驾护航。
2. 在编译阶段就可以发现大部分错误。
3. 增加代码补全，接口提示，跳转定义等增强编辑器的功能。
### TypeScript的劣势
1. 对团队会有不小的学习成本，对于偏前端的开发会有理解上的困难
2. 对于小项目，并没有多大的用处，但是对于构建一个较大的项目，可以规避很多小坑

## TypeScript 的数据类型
1. boolean
    ```typeScript
    let isDone: boolean = false
    ```
2. number
    ```typeScript
    let six: number = 6
    let infinity: number = Infinity
    ```
3. string
    ```typeScript
    let str: string = '123'
    let Str: string = `Str = ${str}`
    ```
4. void (空值)，在 TypeScript 中，可以用 void 表示没有任何返回值的函数
    ```typeScript
    function consoleMsg() : void{
        console.log('msg')
    }
    consoleMsg()
    ```
5. null
    ```typeScript
    let n: null = null
    ```
6. undefined
    ```typeScript
    let u: undefined
    ```
7. Symbol (ES6新增)
    ```typeScript
    let sym3 = Symbol("key");
    ```
8. any 可以赋值为任意类型的类型
    ```typeScript
    let anyThing: any = 'hello'
    anyThing = 10
    ```
9.  Interfaces 接口，它是对行为的抽象，而具体行动需要由类去实现
    1. 可选属性 在接口属性后加上 ?
    2. 任意属性 [propName: string]
    3. 只读属性 只能在创建的时候被赋值，readonly
    ```typeScript
    interface Person{
        readonly id: number,
        name: string,
        age?: number | undefined,
        [propName: string]: string | number | undefined
    }
    ```
10. array 数组类型
    1. 「类型 + 方括号」表示法
    2. 数组泛型 `Array<number>`
    3. 接口表示数组
    ```typeScript
    interface NumberArray {
        [index: number]: number;
    }
    var numbers: number[] = [1,1,1,1,3]
    var number1: Array<number> = [1,1,1,1,3]
    var number2: NumberArray = [1,1,1,1,3]
    console.log(numbers)
    console.log(number1)
    console.log(number2)
    var strings: string[] = ['1','1','1','1','3']
    console.log(strings)
    ```
11. object 对象类型
    ```typeScript
    let curry: Person = {
        id: 1,
        name: 'Curry',
        age: 30,
        a: '1'
    }
    ```
12. function 函数类型
    1.  可选参数 ?
    2.  参数默认值 =
    3.  剩余参数 ...
   ```typeScript
    function sum(x: number, y: number): number{
        return x + y
    }
    let sum2: (x: number, y: number) => number = (x, y) => x + y
    console.log(sum(1, 2))
    console.log(sum2(2, 2))
    // 接口也可以表示函数的形状
    interface Say {
        (x?: string, y?: string): string
    }
    let say: Say = (x: string = 'Hello', y) => `${x}-${y || 'MI'}`
    console.log(say('Hi', 'XiaYu'))
    console.log(say())
    let push: (array: number[], ...item: number[]) => number[] = (arr, ...items) => items.map(item => arr.push(item))
    console.log(push([], 1, 2, 4, 3))

    // 重载 重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。
    function reverse(x: number): number | string 
    function reverse(x: string): number | string 
    function reverse(x:any): number | string {
        if (!(<string>x).length) {
            return Number(x.toString().split('').reverse().join(''));
        }else {
            return x.split('').reverse().join('');
        }
    }

    console.log(reverse(123), reverse('456'))

    type Name = string;
    type NameResolver = () => string;
    type NameOrResolver = Name | NameResolver;
    function getName(n: NameOrResolver): Name {
        if (typeof n === 'string') {
            return n;
        } else {
            return n();
        }
    }

    console.log(getName('1323'))
    console.log(getName(()=>'222'))
   ```
16. Tuple，元组合并了不同类型的对象的数组。
    ```typescript
    let tuple: [string , number | string]
    tuple = ['1', 1]
    ```
17. Enum，枚举用于取值被限定在一定范围内的场景
    ```typescript
    enum Status { load, unload }
    console.log(Status['load'])
    ```
18. Never 类型表示的是那些永不存在的值的类型
    ```typeScript
    const error = (msg:string):never => {
        throw new Error(msg)
    }
    error('我是个错误')
    ```
19. 类型断言：可以用来手动指定一个值的类型。断言成一个联合类型中不存在的类型是不允许的
    ```typeScript
    const getLenByList = (str: string | number): number => {
        if((str as string).length){
            return (<string>str).length
        }else{
            return str.toString().length
        }
    }
    console.log(getLenByList(123321))
    console.log(getLenByList('123321'))
    ```