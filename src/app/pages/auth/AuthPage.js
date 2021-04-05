import React from "react";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic";
import "../../../_metronic/_assets/sass/pages/login/login-1.scss";
import Login from "./Login";
// import Registration from "./Registration";
import ForgotPassword from "./ForgotPassword";
import ConfirmForgotPassword from "./ConfirmForgotPassword";
import './authStyle.scss';

export default function AuthPage() {
  return (
    <>
      <div className="kt-grid kt-grid--ver kt-grid--root">
        <div
          id="kt_login"
          className="kt-grid kt-grid--hor kt-grid--root kt-login kt-login--v1"
        >
          <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">
            <div
              className="kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside img-center"
              style={{
                backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-4.jpg")})`
              }}
            >
              <div className="kt-grid__item">
                <Link to="/" className="kt-login__logo">
                  <img
                    alt="Logo Edu"
                    src={toAbsoluteUrl("")}
                  />
                </Link>
              </div>
            </div>

            <div className="kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper box-right">
              <Switch>
                <Route path="/auth/login" component={Login} />
                {/* <Route path="/auth/registration" component={Registration} /> */}
                <Route
                  path="/auth/forgotPassword"
                  component={ForgotPassword}
                />
                <Route
                  path="/auth/confirmForgot/:email/:strConfirm"
                  component={ConfirmForgotPassword}
                />
                <Redirect from="/auth" exact={true} to="/auth/login" />
                <Redirect to="/auth/login" />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
