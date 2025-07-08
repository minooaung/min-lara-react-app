import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { handleApiError, ValidationErrors } from "../utils/apiErrorHandler";

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface SignupResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role?: string;
    [key: string]: any;
  };
}

export default function Signup() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmationRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<ValidationErrors | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!nameRef.current || !emailRef.current || !passwordRef.current || !passwordConfirmationRef.current) {
      return;
    }

    setErrors(null);

    const payload: SignupPayload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    try {
      const { data } = await axiosClient.post<SignupResponse>("/signup", payload);
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