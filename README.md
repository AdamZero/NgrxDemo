[TOC]



# ngrx详解

## [ngrx](https://github.com/ngrx/platform)是什么

基于rxjs，参考redux的适用于angularjs的状态管理插件,可以用于全局变量的修改和监控

## 使用方法

### 1.安装ngrx

> yarn add @ngrx/core @ngrx/router@latest -S

### 2.建立ngrx文件夹

建立如图所示目录以存放文件

| -- src
​	| -- app
​		| -- ngrx
​			| -- actions（文件夹）
​			| -- reducers（文件夹）
​			| -- index.ts

### 3.在actions目录下创建action

按照下述格式新建action文件：

```typescript
import { Action } from '@ngrx/store';

// 以枚举或者const 声明常量
export enum ActionTypes {
  //常量值： [作用对象]作用效果 或 作用对象_作用效果
  CHANGE = '[THEME] CHANGE',
}

// 继承自Action
export class Change implements Action {
  readonly type = ActionTypes.CHANGE;//类型对应自己的常量
	// payload是触发action是可以传递的参数
  constructor(public payload: String) { } 
}

// 合并导出所有Action对象
export type Actions
  = Change;


```

### 4.在reducers目录下创建reducer

按照下述格式新建reducer文件：

```typescript
// 导入对应的action对象
import * as themeAction from '../actions/theme';

// State是要保存的数据对象
export interface State {
  theme: String;
}

//initialState是初始化的数据对象,部分属性可以从config属性中导入
const initialState: State = {
  theme: 'theme1'
};

/**
 * 根据action类型做对应的处理
 * @param state 持久化的对象
 * @param action 操作对象,包含type(类型)和payload(值)属性
 */
export function reducer(state = initialState, action: themeAction.Actions): State {
  switch (action.type) {
    // 不同action分开处理
    case themeAction.ActionTypes.CHANGE:
      // 把要改变的属性合并到原对象中
      // 此处只要返回新的state对象即可
      // 简单对象不管新建或修改都可以
      // 复杂对象还是合并属性比较好,不然很容易丢失数据
      // 下面的写法同: Object.assign({},state,{theme:action.payload})
      return { ...state, theme: action.payload };

    // 默认返回初始化对象
    default:
      return state;
  }
}

/**
 * 取数据,把自己需要的数据直接从State中取出来
 * @param state State对象
 */
export const getTheme = (state: State) => state.theme


```

### 5.在index.ts中管理action和reducer

```typescript
import { ActionReducerMap, createSelector, createFeatureSelector, ActionReducer, MetaReducer, } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import * as themeReducer from './reducer/theme';
import * as layoutReducer from './reducer/layout';
import * as fromRouter from '@ngrx/router-store';

// 绑定key和模块,便于管理
export interface State {
  _theme: themeReducer.State;
  _layout: layoutReducer.State;

  router: fromRouter.RouterReducerState;
}
// 绑定key和reducer,便于管理和导入
export const reducers: ActionReducerMap<State> = {
  _theme: themeReducer.reducer,
  _layout: layoutReducer.reducer,
  router: fromRouter.routerReducer
};

// 打印actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state: State, action: any): any => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();

    return result;
  };
}

/**
 * 根据环境变量配置拦截器，此处只配置了store中值变化的日志打印
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger]
  : [];

/**
 * 根据key创建Selector
 */
export const getThemeState = createFeatureSelector<State, themeReducer.State>(
  '_theme'
);

/**
 * 对数据进行处理,拿到自己想要的部分
 */
export const getTheme = createSelector(getThemeState, themeReducer.getTheme)
```

### 6.在model中导入

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Page1Component } from './pages/page1/page1.component';
import { Page2Component } from './pages/page2/page2.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './ngrx';
import { AppRouter } from './router';
@NgModule({
  declarations: [
    AppComponent,
    Page1Component,
    Page2Component
  ],
  imports: [
    AppRouter,
    BrowserModule,
     //这里导入reducers
    StoreModule.forRoot(reducers, { metaReducers })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 7.在文件中使用

1. #### 初始化

   ```typescript
   //方法1(不推荐)
   constructor(private store: Store<fromRoot.State>) {
       // 直接select,拿到Observal对象
       this.theme$ = this.store.select('_theme')
     }
   // 方法2(推荐)
   constructor(private store: Store<fromRoot.State>) {
       //通过管道处理
       this.theme$ = 	this.store.pipe(select(fromRoot.getTheme))
     }
   ```

2. #### 触发事件

   ```typescript
   this.store.dispatch(new  	 	       themeAction.Change(themeName))
   ```

3. #### 监听改变

   ```typescript
   // 方法1(不推荐,对应初始化的方法1)
   // 把res对象赋值给本地对象之后即可在html中渲染
   ngOnInit() {
       this.themeSub$ = this.theme$.subscribe((res: any) => {
         console.log(res)
       })
   }
   ngOnDestroy() {
      this.themeSub$.unsubscribe()
   }
   
   
   // 方法2(推荐,对应初始化的方法2)
   // 直接在html中使用  "{{theme$|async}}"
   // 免去了绑定和解绑的过程
   
   ```


自此基本使用已经介绍完毕,下面说一下监听路由改变

## 监听路由

监听路由的reducer和action跟正常的定义方法是一样的,唯一不同在于触发的方法

触发方法如下:

```typescript
constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    this.countSub$ = route.params.pipe(map(params => new countActions.CountAdd())).subscribe(store)
    this.count$ = this.store.pipe(select(fromRoot.getCount))
  }
```

route中有路由对象,可以拿到想要的参数,那params去调用新建action,可以把param里的value传递到Action里,之后subscribe监听一下即可

不要忘了在onDestroy中unSubscribe哦



介绍完了路由的监听,大家应该可以正常使用ngrx了,但是还有部分概念可能还不太了解,下面简单分析一下源码

## 说明

### Action

操作的基类,封装了只读属性type,用以定义操作的类型

```typescript
export interface Action {
    type: string;
}
```

### createFeatureSelector

源码:

```
export declare function createFeatureSelector<T, V>(featureName: keyof T): MemoizedSelector<T, V>;
```

createFeatureSelector返回MemoizedSelector对象,而MemoizedSelector继承自Selector

```typescript
export interface MemoizedSelector<State, Result> extends Selector<State, Result> {
    release(): void;
    projector: AnyFn;
}
```

而Selector是做什么的呢,我们看一下源码

```
export declare type Selector<T, V> = (state: T) => V;
```

从源码可以看出Selector接收两个泛型T,V,之后把T类型的state转化为V类型

所以之前使用到的

```typescript
export const getThemeState = createFeatureSelector<State, themeReducer.State>(
  '_theme'
);
```

就表示从Actions中选择出"_theme"对应的Action并把类型从State转化成themeReducer.State,而themeReducer.State本身就是包含在此State中的

### createSelector

源码:

```typescript
export declare function createSelector<State, S1, Result>(s1: Selector<State, S1>, projector: (s1: S1) => Result): MemoizedSelector<State, Result>;
```

接收三个泛型,State(状态),S1(要转化的State,也就是上面createFeatureSelector中第二个参数),Result(结果)

接收两个参数,s1(一个selector对象),projector,处理s1的函数,把s1转化为Result,最终返回结果是包含State和Result的泛型的Selector对象

简单来说就是Selector传递了两个参数,把第一个参数里的值作为参数传递给第二个参数去执行



补充说明:**ngrx不支持通过a标签直接跳转路由,如果通过a标签跳转,每次跳转都会使State初始化**

开发环境:

* node: v11.1.0
* npm: 6.4.1
* Angular CLI: 6.1.3
* ngrx/core:1.2.0
* ngrx/router-store: 6.1.2
* ngrx/store: 6.1.2



**有问题请私信或留言**

**谢谢阅读,希望可以帮助到你**

 