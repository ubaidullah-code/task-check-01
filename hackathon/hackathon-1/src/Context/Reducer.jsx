export const reducer = (state, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return {
        isLogin: true,
        user: action.payload,
        isAdmin: false,
        isManager: false,
      };
    case "ADMIN_LOGIN":
      return {
        isLogin: true,
        user: action.payload,
        isAdmin: true,
        isManager: false,
      };
    case "MANEGER_LOGIN":
      return {
        isLogin: true,
        user: action.payload,
        isAdmin: false,
        isManager: true,
      };
    case "USER_LOGOUT":
      return {
        isLogin: false,
        user: {},
        isAdmin: false,
        isManager: false,
      };
    default:
      return state;
  }
};
