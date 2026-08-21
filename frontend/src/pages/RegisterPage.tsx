import { Link, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import './Auth.css';
import { registerUser } from '../api/auth';
import { validateEmail } from '../utils/validation';
import logoMark from '../assets/landing/logo-mark.svg';
import illustration from '../assets/register/register-illustration.png';

type FormData = {
  name: string;
  email: string;
  password: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

const NAME_REQUIRED = 'Full name is required';
const PASSWORD_HINT = 'At least 8 characters, include letters and numbers.';
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function validateName(value: string): string | null {
  return value.trim() ? null : NAME_REQUIRED;
}

function validateNewPassword(value: string): string | null {
  if (!value) {
    return 'Password is required';
  }
  if (!PASSWORD_PATTERN.test(value)) {
    return PASSWORD_HINT;
  }
  return null;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [duplicateEmail, setDuplicateEmail] = useState(false);
  const [success, setSuccess] = useState(false);

  function validateAll(): FieldErrors {
    return {
      name: validateName(data.name) ?? undefined,
      email: validateEmail(data.email) ?? undefined,
      password: validateNewPassword(data.password) ?? undefined,
    };
  }

  function handleBlur(key: keyof FormData) {
    const validators = {
      name: validateName,
      email: validateEmail,
      password: validateNewPassword,
    };
    setErrors((prev) => ({
      ...prev,
      [key]: validators[key](data[key]) ?? undefined,
    }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const nextErrors = validateAll();
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setButtonDisabled(true);
    try {
      await registerUser(data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1600);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('User already exists')) {
        setDuplicateEmail(true);
      } else {
        setFormError('Please contact support');
      }
    } finally {
      setButtonDisabled(false);
    }
  }

  return (
    <div className="auth-page">
      <Link to="/" className="auth-page-logo">
        <img src={logoMark} alt="" />
        <span>CareerMate AI</span>
      </Link>

      <div className="auth-layout">
        <div className="auth-form-panel">
          {success ? (
            <div className="auth-success">
              <div className="auth-success-badge">
                <div className="auth-success-badge-inner">
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                    <path
                      d="M2 10L10 18L26 2"
                      stroke="#fff"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="auth-success-message">🎉 Registration successful! Logging you in...</p>
            </div>
          ) : (
            <>
              <h1 className="auth-heading">Create Your Account</h1>
              <p className="auth-subheading">
                Join CareerMate AI and start your smart career journey
              </p>

              <form className="auth-form" onSubmit={onSubmit} noValidate>
                <div className="auth-field">
                  <label htmlFor="name">Full Name</label>
                  <div className="auth-input-wrap">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      className={`auth-input ${errors.name ? 'has-error' : ''}`}
                      value={data.name}
                      onBlur={() => handleBlur('name')}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                    />
                  </div>
                  {errors.name && <span className="auth-field-hint">{errors.name}</span>}
                </div>

                <div className="auth-field">
                  <label htmlFor="email">Email</label>
                  <div className="auth-input-wrap">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Your email"
                      className={`auth-input ${errors.email ? 'has-error' : ''}`}
                      value={data.email}
                      onBlur={() => handleBlur('email')}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                  </div>
                  {errors.email && <span className="auth-field-hint">{errors.email}</span>}
                </div>

                <div className="auth-field">
                  <label htmlFor="password">Password</label>
                  <div className="auth-input-wrap">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      className={`auth-input auth-input-password ${
                        errors.password ? 'has-error' : ''
                      }`}
                      value={data.password}
                      onBlur={() => handleBlur('password')}
                      onChange={(e) => setData({ ...data, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="auth-toggle-visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z"
                            stroke="currentColor"
                            strokeWidth="1.3"
                          />
                          <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.3" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z"
                            stroke="currentColor"
                            strokeWidth="1.3"
                          />
                          <path
                            d="M1.5 1.5l13 13"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <span className="auth-field-hint">{errors.password}</span>}
                </div>

                {formError && <p className="auth-form-error">{formError}</p>}

                <button type="submit" className="auth-submit" disabled={buttonDisabled}>
                  Create Account
                </button>
              </form>

              <p className="auth-footer">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </>
          )}
        </div>

        <div
          className="auth-illustration-panel"
          style={{ backgroundImage: `url(${illustration})` }}
        >
          <p className="auth-collage-caption">People find their own coach</p>

          <div className="auth-collage-avatars">
            <div className="auth-collage-avatar" style={{ background: '#504ffd' }}>
              A
            </div>
            <div className="auth-collage-avatar" style={{ background: '#40c3fb' }}>
              B
            </div>
            <div className="auth-collage-avatar" style={{ background: '#3266ff' }}>
              C
            </div>
          </div>

          <div className="auth-collage-subscribe">SUBSCRIBE</div>

          <div className="auth-collage-testimonial">
            <p>Tried many, but this AI stands out!🔥</p>
            <div className="auth-collage-testimonial-author">
              <div className="auth-collage-testimonial-avatar" />
              <span>Username</span>
            </div>
          </div>

          <div className="auth-collage-glass">
            <p>Built with the Power of AI Engineering</p>
          </div>

          <div className="auth-collage-badges">
            <div className="auth-collage-badge" />
            <div className="auth-collage-badge auth-collage-badge-navy" />
          </div>
        </div>
      </div>

      {duplicateEmail && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <div className="auth-modal-warning">!</div>
            <p className="auth-modal-message">Email already registered, please log in instead</p>
            <Link to="/login" className="auth-modal-button">
              Go to login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
