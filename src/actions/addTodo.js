// import { ADD_TODO } from './types';

export function addTodo(todo){
  return function(dispatch){
    firebase.database().ref(`todos`).push(todo)
    .catch(error => {
      dispatch({type: "FETCH_ERROR", error: error.message});
    })
  }
}

export function addTodoListener(){
  return function(dispatch){
    return firebase.database().ref(`todos`).on('child_added', snapshot =>{
      /* snapshot is the item that is being adde, same as before, grab the
      * value, then add the key. After we have created this, dispatch!
      * Same logic in all the listeners
      */
      const todo = {...snapshot.val(), key: snapshot.key };
      dispatch({ type: ADD_TODO, todo })
    })
  }
}