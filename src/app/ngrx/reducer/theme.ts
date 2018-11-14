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

