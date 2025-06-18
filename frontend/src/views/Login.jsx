import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";

// import { useStateContext } from "../contexts/ContextProvider";

import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

import { handleApiError } from "../utils/apiErrorHandler";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [errors, setErrors] = useState(null);

  // Via Context API
  //const { setUser, setToken } = useStateContext();

  const dispatch = useDispatch();

  const navigate = useNavigate(); // ✅ Create navigate function

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    setErrors(null);

    axiosClient
      .get("/sanctum/csrf-cookie") // ✅ Always get CSRF cookie before login
      .then(() => {
        return axiosClient.post("/login", payload);
      })
      .then(({ data }) => {
        console.log("Login response data:", data); // Log the response data

        dispatch(authActions.settingUser(data.user));
        navigate("/users");
      })
      .catch((err) => {
        console.log(err);
        setErrors(handleApiError(err));

        // const response = err.response;
        // if (response && response.status == 422) {
        //   setErrors(response.data.errors || { email: [response.data.message] });
        // }
      });
  };

  // let csrfInitialized = false;

  // const onSubmit = (ev) => {
  //   ev.preventDefault();

  //   const payload = {
  //     email: emailRef.current.value,
  //     password: passwordRef.current.value,
  //   };

  //   setErrors(null);

  //   const login = () => {
  //     return axiosClient.post("/login", payload);
  //   };

  //   const initCSRFIfNeeded = () => {
  //     if (csrfInitialized) return Promise.resolve();
  //     return axiosClient.get("/sanctum/csrf-cookie").then(() => {
  //       csrfInitialized = true;
  //     });
  //   };

  //   initCSRFIfNeeded()
  //     .then(() => login())
  //     .then(({ data }) => {
  //       dispatch(authActions.settingUser(data.user));
  //       navigate("/users");
  //     })
  //     .catch((err) => {
  //       const response = err.response;
  //       if (response && response.status == 422) {
  //         setErrors(response.data.errors || { email: [response.data.message] });
  //       }
  //     });
  // };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Login into your account</h1>

          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}

          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <button className="btn btn-block">Login</button>

          <p className="message">
            Not Registered? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
