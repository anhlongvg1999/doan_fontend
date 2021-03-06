import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken } from "../../crud/auth.crud";
import * as routerHelpers from "../../router/RouterHelpers";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",
  ForgotPassword: "[ForgotPassword] Action",
  ConfirmForgotPassword: "[ConfirmForgotPassword] Action"
};

const initialAuthState = {
  user: undefined,
  authToken: undefined,
  userRole: undefined
};

export const reducer = persistReducer(
  { storage, key: "vietlook-auth", whitelist: ["user", "authToken", "userRole"] },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        console.log('azzzzzzzzzzzzzz',action)
        const { authToken } = action.payload;
        console.log('payloadaaaaa',authToken);
        return { authToken, user: undefined, userRole: undefined };
      }

      case actionTypes.ForgotPassword: {
        const { authToken } = action.payload;

        return { authToken, user: undefined, userRole: undefined };
      }

      case actionTypes.ConfirmForgotPassword: {
        const { authToken } = action.payload;

        return { authToken, user: undefined, userRole: undefined };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;

        return { authToken, user: undefined, userRole: undefined };
      }

      case actionTypes.Logout: {
        routerHelpers.forgotLastLocation();
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const { user, userRole } = action.payload;
        return { ...state, user, userRole };
      }

      default:
        return { ...state };
    }
  }
);

export const actions = {
  login: authToken => ({ type: actionTypes.Login, payload: { authToken } }),
  register: authToken => ({
    type: actionTypes.Register,
    payload: { authToken }
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: user => ({ type: actionTypes.UserRequested, payload: { user } }),
  fulfillUser: (user, userRole) => ({ type: actionTypes.UserLoaded, payload: { user, userRole } })
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga(data) {
    yield put(actions.requestUser(data.payload.authToken));
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested(data) {
    const { data: user } = yield getUserByToken(data.payload.user);
    if (user.signal) {
      yield put(actions.fulfillUser(user.data));
    } else {
      yield put(actions.logout());
    }
  });
}
