import firebase from '../firebase';

export function addPost(post){
  return function(dispatch){
    firebase.database().ref(`posts`).push(post)
    .catch(error => {
      dispatch({type: "FETCH_ERROR", error: error.message});
    })
  }
}

export function addPostListener(){
  return function(dispatch){
    return firebase.database().ref(`posts`).on('child_added', snapshot =>{
      /* snapshot is the item that is being adde, same as before, grab the
      * value, then add the key. After we have created this, dispatch!
      * Same logic in all the listeners
      */
      const post = {...snapshot.val(), key: snapshot.key };
      dispatch({ type: "CHILD_ADDED", post })
    })
  }
}