import { PROGRESS_ACTION } from '../actionTypes';
import progressState from '../states/progressState';

const progressReducer = (state = progressState.initState, action) => {
  switch (action.type) {
    case PROGRESS_ACTION.GET_PROGRESS_SUCCESS:
      return {
        ...state,
        progress: action.data,
      };
    default:
      return state;
  }
};

export default progressReducer;
