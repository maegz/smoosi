export default function error(state = [], action) {
  switch (action.type) {
    case "SIGN_IN":
      return action.user;
    case "SIGN_OUT":
      return action.user;
    default:
      return state;
  }
}