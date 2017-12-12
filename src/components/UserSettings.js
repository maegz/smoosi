import React, { Component } from 'react';
import firebase from '../firebase';

export default class UserSettings extends Component {

  state = {
    users: ""
  }

  componentDidMount() {
    firebase.database().ref(`users`).on('value', fetchUsers => {
      this.setState({ users: fetchUsers.val() });
    })
  }

  remove = (user) => {
    firebase.database().ref(`users/${user}`).remove()
      .catch(error => { console.log(error) })
  }

  
  render() {
    
    const users = this.state.users;
    let tempList = []
    var testing = Object.keys(users).map(function(key) {
      return users[key]
    })

    for (const key in testing) {
      if (testing.hasOwnProperty(key)) {
        tempList.push(testing[key]);
      }
    }
    const mapping = testing.map(user =>
      <div key={ user.uid }>
        <p>{ user.email }
        <button className="button" onClick={() => this.remove(user.uid)}>Delete user</button>
        </p>
      </div>
    )

    return(
      <div>
        {mapping}
      </div>
    )
  }

}