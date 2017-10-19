import firebase from '../firebase';

export function userChanged() {
  return function(dispatch) {
    return firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        firebase.database().ref(`users/${user.uid}`).once('value')
        .then(user => {
          dispatch({ type: "SIGN_IN", user: user });
        });
      } else {
        console.log(user);
        dispatch({ type: "SIGN_OUT", user: null });
      }
    });
  }
}



/**
 * 
 * Vote-checker:
 * todo               = this post
 * clickedValue       = users clicked value
 * user               = this user
 * 
 * isUserVotingOnSelf = checks if the id of current user and the creator of the post match
 * thisTodoVote       = database reference for this posts votes
 * thisUserTodoVote   = database reference for this users vote for this post
 * 
 */
export function vote(todo, clickedValue, user) {
  return function(dispatch) {

    let isUserVotingOnSelf = (todo.madeBy === user.uid);
    const thisTodoVote = firebase.database().ref(`todos/${ todo.key }/votes`);
    const thisUserTodoVote = firebase.database().ref(`users/${ user.uid }/votes/${ todo.key }`);
    
    // If the current user didn't create this post, voting is possible.
    if (!isUserVotingOnSelf) {
      thisUserTodoVote.once("value", snapshot => {
        const currentUserDatabaseValue = snapshot.val();        
        
        // If the users database-vote is the opposite of the clicked value, 
        // the new vote-value is set and the users database-vote is removed.
        if ((currentUserDatabaseValue === 1 && clickedValue === -1) || 
          (currentUserDatabaseValue === -1 && clickedValue === 1)) {
          thisTodoVote.set(todo.votes += clickedValue)
            .then(thisUserTodoVote.remove())
            .catch(error => { dispatch({ type: "FETCH_ERROR", error: error.message }) });
        }
        
        // If the users database-vote doesn't match the clicked value,
        // the new vote-value is set and the users database-vote is set.
        if (currentUserDatabaseValue !== clickedValue) {
          console.log("röst lagd: ", clickedValue)
          thisTodoVote.set(todo.votes += clickedValue)
            .then(thisUserTodoVote.set(clickedValue))
            .catch(error => { dispatch({ type: "FETCH_ERROR", error: error.message }) });
        } 
        
        // If the users database-vote matches the clicked value,
        // the new vote-value is the opposite to the clicked value
        // and the users database-vote is removed.
        else {
          console.log("röst borttagen")
          thisTodoVote.set(todo.votes -= clickedValue)
            .then(thisUserTodoVote.remove())
            .catch(error => { dispatch({ type: "FETCH_ERROR", error: error.message }) });    
        }
      });
    } 
    // If the current user did create this post, voting isn't possible.
    else {
      dispatch({ type: "FETCH_ERROR", error: "You can't vote on your own smoosi recipe!"})
      console.log("You can't vote on your own smoosi recipe!")
    }
  }
}



/*
* Notice that the actual actions in here doesn't dispatch any actions 
* to the reducers. This is because we have set up listener further down
* If we would dispatch both in the action and the listener we would 
* get double updates. We only need the listeners to make the change
*/
export function addTodo(todo){
  return function(dispatch){
    firebase.database().ref(`todos`).push(todo)
    .catch(error => {
      dispatch({type: "FETCH_ERROR", error: error.message});
    })
  }
}


/**
 * When removing post, also remove all user-votes on the very same post.
 */
export function removeTodo(todo) {
  return function (dispatch) {
    firebase.database().ref("users").once("value")
      .then((snapshot) => {
        // Get all users uid's and remove each vote connected to the todo.
        let allUsers = snapshot.val();
        for (var user in allUsers) {
          firebase.database().ref(`users/${ user }/votes/${ todo.key }`).remove();
        }
      });
    // Then delete the todo itself.
    firebase.database().ref(`todos/${ todo.key }`).remove()
      .catch(error => { dispatch({ type: "FETCH_ERROR", error: error.message }) })
  }
}

export function toggleCompleted(todo){
  return function (dispatch){
    // We can set just a part of an object, like the completed property on
    // just one item. Go to the path of the resource and change the value
    firebase.database().ref(`todos/${todo.key}/completed`).set(!todo.completed)
    .catch(error => {
      dispatch({type: "FETCH_ERROR", error: error.message});
    })
  }
}


export function editTodo(todo){
  return function (dispatch){
    //Be advised that '.set()' REPLACES THE WHOLE OBJECT, it 
    //doesn't just update the values that needs to be updated
    firebase.database().ref(`todos/${todo.key}`).set({
      text: todo.text,
      completed: todo.completed,
      madeBy: todo.madeBy,
      votes: todo.votes
    })
    .catch(error => {
      dispatch({type: "FETCH_ERROR", error: error.message});
    })
  }
}
  
  
/*
* Three event listeners, one for listening when we add a todo, 'child_added',
* one when we update any value in a child: 'child_changed' and one when 
* a todo is removed from 'todos: 'child_removed'
*/
export function addTodoListener(){
  return function(dispatch){
    return firebase.database().ref(`todos`).on('child_added', snapshot =>{
      /* snapshot is the item that is being adde, same as before, grab the
      * value, then add the key. After we have created this, dispatch!
      * Same logic in all the listeners
      */
      const todo = {...snapshot.val(), key: snapshot.key };
      dispatch({ type: "CHILD_ADDED", todo })
    })
  }
}

export function changeTodoListener(){
  return function(dispatch){
    return firebase.database().ref(`todos`).on('child_changed', snapshot =>{
      const todo = {...snapshot.val(), key: snapshot.key };
      dispatch({ type: "CHILD_CHANGED", todo })
    })
  }
}

export function removeTodoListener(){
  return function(dispatch){
    return firebase.database().ref(`todos`).on('child_removed', snapshot => {
      const todo = {...snapshot.val(), key: snapshot.key };
      dispatch({ type: "CHILD_REMOVED", todo })
    })
  }
}