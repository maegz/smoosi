import firebase from '../firebase';

export function userChanged() {
  return function(dispatch) {
    return firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user.uid);
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
 * post               = this post
 * clickedValue       = users clicked value
 * user               = this user
 * 
 * isUserVotingOnSelf = checks if the id of current user and the creator of the post match
 * thisPostVote       = database reference for this posts votes
 * thisUserPostVote   = database reference for this users vote for this post
 * 
 */
export function vote(post, clickedValue, user) {
  return function(dispatch) {

    let isUserVotingOnSelf = (post.madeBy === user.uid);
    const thisPostVote = firebase.database().ref(`posts/${ post.key }/votes`);
    const thisUserPostVote = firebase.database().ref(`users/${ user.uid }/votes/${ post.key }`);
    
    // If the current user didn't create this post, voting is possible.
    if (!isUserVotingOnSelf) {
      thisUserPostVote.once("value", snapshot => {
        const currentUserDatabaseValue = snapshot.val();        
        
        // If the users database-vote is the opposite of the clicked value, 
        // the new vote-value is set and the users database-vote is removed.
        if ((currentUserDatabaseValue === 1 && clickedValue === -1) || 
          (currentUserDatabaseValue === -1 && clickedValue === 1)) {
          thisPostVote.set(post.votes += clickedValue)
            .then(thisUserPostVote.remove())
            .catch(error => { dispatch({ type: "FETCH_ERROR", error: error.message }) });
        }
        
        // If the users database-vote doesn't match the clicked value,
        // the new vote-value is set and the users database-vote is set.
        if (currentUserDatabaseValue !== clickedValue) {
          console.log("röst lagd: ", clickedValue)
          thisPostVote.set(post.votes += clickedValue)
            .then(thisUserPostVote.set(clickedValue))
            .catch(error => { dispatch({ type: "FETCH_ERROR", error: error.message }) });
        } 
        
        // If the users database-vote matches the clicked value,
        // the new vote-value is the opposite to the clicked value
        // and the users database-vote is removed.
        else {
          console.log("röst borttagen")
          thisPostVote.set(post.votes -= clickedValue)
            .then(thisUserPostVote.remove())
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
export function addPost(post){
  return function(dispatch){
    console.log(post)
    firebase.database().ref(`posts`).push(post)
    .catch(error => {
      dispatch({type: "FETCH_ERROR", error: error.message});
    })
  }
}


/**
 * When removing post, also remove all user-votes on the very same post.
 */
export function removePost(post) {
  return function (dispatch) {
    firebase.database().ref("users").once("value")
      .then((snapshot) => {
        // Get all users uid's and remove each vote connected to the post.
        let allUsers = snapshot.val();
        for (var user in allUsers) {
          firebase.database().ref(`users/${ user }/votes/${ post.key }`).remove();
        }
      });
    // Then delete the post itself.
    firebase.database().ref(`posts/${ post.key }`).remove()
      .catch(error => { dispatch({ type: "FETCH_ERROR", error: error.message }) })
  }
}

export function toggleCompleted(post){
  return function (dispatch){
    // We can set just a part of an object, like the completed property on
    // just one item. Go to the path of the resource and change the value
    firebase.database().ref(`posts/${post.key}/completed`).set(!post.completed)
    .catch(error => {
      dispatch({type: "FETCH_ERROR", error: error.message});
    })
  }
}


export function editPost(post){
  return function (dispatch){
    //Be advised that '.set()' REPLACES THE WHOLE OBJECT, it 
    //doesn't just update the values that needs to be updated
    firebase.database().ref(`posts/${post.key}`).set({
      text: post.text,
      madeBy: post.madeBy,
      votes: post.votes
    })
    .catch(error => {
      dispatch({type: "FETCH_ERROR", error: error.message});
    })
  }
}
  
  
/*
* Three event listeners, one for listening when we add a post, 'child_added',
* one when we update any value in a child: 'child_changed' and one when 
* a post is removed from 'posts: 'child_removed'
*/
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

export function changePostListener(){
  return function(dispatch){
    return firebase.database().ref(`posts`).on('child_changed', snapshot =>{
      const post = {...snapshot.val(), key: snapshot.key };
      dispatch({ type: "CHILD_CHANGED", post })
    })
  }
}

export function removePostListener(){
  return function(dispatch){
    return firebase.database().ref(`posts`).on('child_removed', snapshot => {
      const post = {...snapshot.val(), key: snapshot.key };
      dispatch({ type: "CHILD_REMOVED", post })
    })
  }
}