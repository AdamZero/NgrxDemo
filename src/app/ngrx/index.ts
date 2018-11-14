import { ActionReducerMap, createSelector, createFeatureSelector, ActionReducer, MetaReducer, } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import * as themeReducer from './reducer/theme';
import * as layoutReducer from './reducer/count';
import * as fromRouter from '@ngrx/router-store';

// 绑定key和模块,便于管理
export interface State {
  _theme: themeReducer.State;
  _count: layoutReducer.State;

  router: fromRouter.RouterReducerState;
}
// 绑定key和reducer,便于管理和导入
export const reducers: ActionReducerMap<State> = {
  _theme: themeReducer.reducer,
  _count: layoutReducer.reducer,
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

export const getCountState = createFeatureSelector<State, layoutReducer.State>(
  '_count'
);

export const getCount = createSelector(
  getCountState,
  layoutReducer.getCount
);

