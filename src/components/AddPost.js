import React from 'react';
import firebase from '../firebase';

export default function AddPost(props) {
  
  function add() {
    props.addPost({
      madeBy: firebase.auth().currentUser.uid,
      text: props.text,
      completed: false,
      votes: 0
    });
  }

  return (
    <div className="addPost">
      <input type="text" onChange={ props.onChange } name="value" value={ props.text } />
      <button className="button" onClick={ add }>Add a smoosi!</button>
    </div>
  )
}