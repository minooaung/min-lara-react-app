import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";

// import { useStateContext } from "../contexts/ContextProvider";

import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth";

import { handleApiError } from "../utils/apiErrorHandler";

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

  const onSubmit = async (ev) => {
    ev.preventDefault();

    setErrors(null); // Reset errors before new request

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    try {
      const { data } = await axiosClient.post("/signup", payload);
      dispatch(authActions.settingUser(data.user));
      navigate("/users");
    } catch (err) {
      console.log("Signup Error:", err);
      setErrors(handleApiError(err));
      setTimeout(() => setErrors(null), 5000);
    }
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
