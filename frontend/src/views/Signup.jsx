import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/queries/useAuth";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const navigate = useNavigate();

  const signupMutation = useSignup();

  const onSubmit = async (ev) => {
    ev.preventDefault();

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    try {
      await signupMutation.mutateAsync(payload);
      navigate("/users");
    } catch (err) {
      // Error handling is done in the mutation hook
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Create an account</h1>

          {signupMutation.error && (
            <div className="alert">
              {Object.keys(signupMutation.error).map((key) => (
                <p key={key}>{signupMutation.error[key][0]}</p>
              ))}
            </div>
          )}

          <input ref={nameRef} placeholder="Full Name" required />
          <input ref={emailRef} type="email" placeholder="Email" required />
          <input ref={passwordRef} type="password" placeholder="Password" required />
          <input
            ref={passwordConfirmationRef}
            type="password"
            placeholder="Password Confirmation"
            required
          />
          
          <button 
            className="btn btn-block"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Creating account..." : "Signup"}
          </button>
          
          <p className="message">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
