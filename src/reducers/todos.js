/* PAY ATTENTION
 * Not much has changed in the logic of the mapping and the filtering
 * the same thing should happen, we filter when we want to remove an item
 * and we merge the new todo with the old todo when we need a change.
 * The new thing here is that we are listening to child added, changed and removed
 */

export default function todos(state = [], action){
  switch(action.type){
    case "FETCH_ALL_TODOS":
      //Don't need to manipulate the state, just return the whole array of objects!
      return action.todos;
    case "CHILD_ADDED":
      return [...state, action.todo];
    case "CHILD_REMOVED":
      return state.filter(todo => todo.key !== action.todo.key)
    case "CHILD_CHANGED":
      return state.map(todo => {
        return todo.key === action.todo.key 
          ? Object.assign({}, action.todo, action.todo)
          : todo
      })
    default:
      return state;
  }
}