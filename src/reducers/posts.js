/* PAY ATTENTION
 * Not much has changed in the logic of the mapping and the filtering
 * the same thing should happen, we filter when we want to remove an item
 * and we merge the new post with the old post when we need a change.
 * The new thing here is that we are listening to child added, changed and removed
 */

export default function posts(state = [], action){
  switch(action.type){
    case "FETCH_ALL_POSTS":
      //Don't need to manipulate the state, just return the whole array of objects!
      return action.posts;
    case "CHILD_ADDED":
      return [...state, action.post];
    case "CHILD_REMOVED":
      return state.filter(post => post.key !== action.post.key)
    case "CHILD_CHANGED":
      return state.map(post => {
        return post.key === action.post.key 
          ? Object.assign({}, action.post, action.post)
          : post
      })
    default:
      return state;
  }
}