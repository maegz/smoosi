import React from 'react';
import firebase from '../firebase';


export default function LoginOrRegister(props) {

  const { email, password } = props.state;
  const { onChange } = props;

  function register(e) {
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
        const newUser = {
          email: user.email,
          isAdmin: false,
          uid: user.uid,
          votes: {}
        }
        firebase.database().ref(`users/${user.uid}`).set(newUser);
      })
  }

  function signIn() {
    firebase.auth().signInWithEmailAndPassword(email, password)
  }
  
  return (
    <div className="logInForm" >
      *IMAGE HERE*
      <form onSubmit={ register }>
        <input type="text" name="email" onChange={ onChange } value={ email } />
        <input type="password" name="password" onChange={ onChange } value={ password } />
        <br/>
        <input className="button" type="submit" value="Register" onChange={ onChange } />
        <button className="button" type="button" onClick={ signIn }>Sign in</button>
      </form>
    </div>
  )
}