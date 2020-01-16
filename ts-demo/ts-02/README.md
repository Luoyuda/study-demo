# TypeScript 中的类

* 类(Class)：定义了一件事物的抽象特点，包含它的属性和方法

    ```typescript
    class P {
        private leg:number = 2
        protected hand:number = 2
        public name:string
        constructor(name:string){
            this.name = name
        }
        say():string {
            return `我是${this.name}，我有${this.leg}条腿和${this.hand}条手`
        }
    }
    ```
* 参数简写

    ```typescript
    class P {
        constructor(private name:string){}
        //这两种写法是等价的
        private name:string
        constructor(name:string){
            this.name = name
        }
    }
    ```

* 对象（Object）：类的实例，通过 new 生成
  
    ```typescript
    let person = new P('person');
    ```

* 面向对象（OOP）的三大特性：封装、继承、多态
* 封装（Encapsulation）：将对数据的操作细节隐藏起来，只暴露对外的接口。外界调用端不需要（也不可能）知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据
* 继承（Inheritance）：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性，通过 extends 关键字，且在构造函数中调用 super() 来实现继承

    ```typescript
    class Chinese extends P {
        readonly country:string = '中国'
        constructor(name:string){
            super(name)
        }
        where(){
            return `我来自${this.country}`
        }
    }
    let xiaYu = new Chinese('xiaYu')
    ```

* 多态（Polymorphism）：由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。
* 存取器（getter & setter）：用以改变属性的读取和赋值行为

    ```typescript
    class Japanese extends P {
        private _country:string = 'XX'
        constructor(name:string){
            super(name)
        }
        get country(): string {
            return `我来自${this._country}`;
        }
        set country(country: string) {
            this._country = country;
        }
    }
    let J = new Japanese('J')
    console.log(J.country) //我来自XX
    J.country = 'JP'
    console.log(J.country) //我来自JP
    ```

* 修饰符（Modifiers）：修饰符是一些关键字，用于限定成员或类型的性质。比如 public 表示公有属性或方法

  * public 共有属性，可以在实例对象/子类/子类实例对象访问到的属性
  * private 私有属性，只能在定义的类内部调用的属性。
  * protected 受保护属性，只能在类及其子类中访问
  * readonly 只读属性，只读属性必须在声明时或构造函数里被初始化，只能读取的属性
  * static 修饰符修饰的方法称为静态方法，它们不需要实例化，而是直接通过类来调用

    ```typescript
    class Chinese {
        private leg:number = 2
        protected hand:number = 2
        public name:string
        readonly country:string = '中国'
        static isChinese(a) {
            return a.country == Chinese.country;
        }
    }
    ```

* 抽象类（Abstract Class）：抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现

    ```typescript
    abstract class P2 {
        constructor(public address:string) {}
        public abstract where():string
    }
    class C extends P2 {
        constructor(address:string){
            super(address)
        }
        where():string{
            return `from ${this.address}`
        }
    }
    var c = new C('C')
    console.log(c.where())
    ```

* 接口（Interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现（implements）。一个类只能继承自另一个类，但是可以实现多个接口

    ```typescript
    interface Run {
        run():string
    }
    interface Eat {
        eat():string
    }
    // 接口继承接口
    interface Dog extends Run, Eat {}
    // 类实现接口
    class Person2 implements Run,Eat {
        run():string{
            return "run by 2 leg"
        }
        eat():string {
            return "eat by 2 hand"
        }
    }
    class Cat {
        run():string{
            return "run by 4 leg"
        }
        eat():string {
            return "eat by mouths"
        }
    }
    // 接口继承类
    interface RedCat extends Cat {}
    class RedCat1 implements RedCat{
        run():string{
            return "red cat run by 4 leg"
        }
        eat():string {
            return "red cat eat by mouths"
        }
    }
    ```