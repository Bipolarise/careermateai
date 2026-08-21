import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail } from '../utils/validation';
import './RegisterPage.css';

type FieldErrors = {
  email?: string;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  function validateForm(): FieldErrors {
    const nextErrors: FieldErrors = {};
    const emailError = validateEmail(email);

    if (emailError) nextErrors.email = emailError;

    return nextErrors;
  }

  function handleBlur() {
    const emailError = validateEmail(email);

    setErrors((prev) => ({
      ...prev,
      email: emailError ?? undefined,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage('');

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSuccessMessage('Reset link sent! Check your email.');
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Forgot password</h1>
        <p className="register-subtitle">Enter your email and we&apos;ll send a reset link</p>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={handleBlur}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-register">
              Send reset link
            </button>
          </div>
        </form>

        {successMessage && <p className="register-success">{successMessage}</p>}

        <p className="register-footer">
          Remember your password? <Link to="/login">Log in</Link>
        </p>

        <p className="register-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
