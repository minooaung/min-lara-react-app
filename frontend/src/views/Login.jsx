import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/queries/useAuth";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const onSubmit = async (ev) => {
    ev.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await loginMutation.mutateAsync(payload);
      navigate("/users");
    } catch (err) {
      // Error handling is done in the mutation hook
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Login into your account</h1>

          {loginMutation.error && (
            <div className="alert">
              {Object.keys(loginMutation.error).map((key) => (
                <p key={key}>{loginMutation.error[key][0]}</p>
              ))}
            </div>
          )}

          <input ref={emailRef} type="email" placeholder="Email" required />
          <input ref={passwordRef} type="password" placeholder="Password" required />
          
          <button 
            className="btn btn-block"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
          
          <p className="message">
            Not registered? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
