import { 
  createStore, 
  combineReducers,
  applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';
import todos from '../reducers/todos';
import error from '../reducers/errors';
import user from '../reducers/users';

const rootReducer = combineReducers({   
  todos,
  user,
  error
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && 
  window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
);

export default store;