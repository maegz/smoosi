import React from 'react';
import firebase from '../firebase';

export default function RatePost(props) {

  const { currentUser, vote, post } = props;
  
  function incrementVote(post) {
    vote(post, 1, currentUser);
  }
  
  function decrementVote(post) {
    vote(post, -1, currentUser)
  }
  
  
  return(
    <div className="ratePost">
      { currentUser.uid === post.madeBy 
      ? <div>{ post.votes }</div> 
      : <div>
          <button className="button" onClick={ () => incrementVote(post) }>
            <span className="glyphicon glyphicon-thumbs-up"></span>
          </button>
          { post.votes }
          <button className="button" onClick={ () => decrementVote(post) }>
            <span className="glyphicon glyphicon-thumbs-down"></span>
          </button>
        </div>
      }
  </div>
  )

}