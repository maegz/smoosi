export default function users(state = [], action) {
  switch (action.type) {
    case "FETCH_ALL_USERS":
      return { ...state, users: action.user };
    case "SIGN_IN":
      return action.user;
    case "SIGN_OUT":
      return action.user;
    default:
      return state;
  }
}