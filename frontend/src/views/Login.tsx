import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { handleApiError } from "../utils/apiErrorHandler";
import { ValidationErrors } from "../utils/apiErrorHandler";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role?: string;
    [key: string]: any;
  };
}

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!emailRef.current || !passwordRef.current) return;

    setErrors(null);

    const payload: LoginPayload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const { data } = await axiosClient.post<LoginResponse>("/login", payload);
      console.log("Login response data:", data);
      dispatch(authActions.settingUser(data.user));
      navigate("/users");
    } catch (err) {
      console.log("Login Error:", err);
      setErrors(handleApiError(err));
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