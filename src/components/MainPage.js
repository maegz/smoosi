import React, { Component } from 'react';
import LoginOrRegister from './LoginOrRegister';
import AddPost from './AddPost';
import PostWall from './PostWall';
import firebase from '../firebase';


export default class MainPage extends Component {

  state = {
    email: "",
    password: "",
    value: ""
  }
  
  onChange = e => this.setState({ [e.target.name]: e.target.value})

  signOut = () => {
    firebase.auth().signOut();
  }
  
  render() {
    const currentUser = firebase.auth().currentUser;

    return (
      <div className="mainPage">
        { 
          this.props.user
        ? <div>
            <button className="button" onClick={ this.signOut }>Sign Out</button>
            <h1>Hej { this.props.user.key }!</h1>
            <AddPost  { ...this.props } text={ this.state.value } onChange={ this.onChange } />
            <PostWall { ...this.props } text={ this.state.value } currentUser={ currentUser } />
          </div>
        : <LoginOrRegister onChange={ this.onChange } state={ this.state } currentUser={ currentUser } />
        }
      </div>
    )
  }
}