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

  const navigate = useNavigate(); // Create navigate function

  const onSubmit = async (ev) => {
    ev.preventDefault();

    setErrors(null); // Reset errors before new request

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      // Login directly without CSRF fetch (since it's initialized at startup)
      const { data } = await axiosClient.post("/login", payload);

      console.log("Login response data:", data);

      dispatch(authActions.settingUser(data.user));
      navigate("/users");
    } catch (err) {
      console.log("Login Error:", err);
      setErrors(handleApiError(err));

      // Auto-clear errors after 5 seconds for smooth UX
      setTimeout(() => setErrors(null), 5000);
    }
  };

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
