import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";

// import { useStateContext } from "../contexts/ContextProvider";

import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  const [errors, setErrors] = useState(null);

  // Via Context API
  //   const { setUser, setToken } = useStateContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    // // Get CSRF cookie before signup
    // axiosClient.get("/sanctum/csrf-cookie").then(() => {
    //   axiosClient
    //     .post("/signup", payload)
    //     .then(({ data }) => {
    //       dispatch(authActions.settingUser(data.user));
    //       navigate("/users");
    //       // Optional: Redirect to authenticated route
    //       //window.location.href = "/dashboard"; // or use navigate()
    //     })
    //     .catch((err) => {
    //       const response = err.response;
    //       if (response && response.status === 422) {
    //         setErrors(response.data.errors);
    //       }
    //     });
    // });

    axiosClient
      .get("/sanctum/csrf-cookie") // ✅ Always get CSRF cookie before Signup
      .then(() => {
        return axiosClient.post("/signup", payload);
      })
      .then(({ data }) => {
        dispatch(authActions.settingUser(data.user));
        navigate("/users");
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors || { email: [response.data.message] });
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Sign up for free</h1>
          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}

          <input ref={nameRef} placeholder="Full Name" />
          <input ref={emailRef} type="email" placeholder="Email Address" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <input
            ref={passwordConfirmationRef}
            type="password"
            placeholder="Password Confirmation"
          />

          <button className="btn btn-block">Sign Up</button>

          <p className="message">
            Already Registered? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
