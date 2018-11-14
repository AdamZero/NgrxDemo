import { Action } from '@ngrx/store';

// 以枚举或者const 声明常量
export enum ActionTypes {
  //常量值： [作用对象]作用效果 或 作用对象_作用效果
  CHANGE = '[THEME] CHANGE',
}

// 继承自Action
export class Change implements Action {
  readonly type = ActionTypes.CHANGE;//类型对应自己的常量

  constructor(public payload: String) { } // payload是触发action是可以传递的参数
}

// 合并导出所有Action对象
export type Actions
  = Change;

