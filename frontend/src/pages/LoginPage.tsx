import { Link, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import './Auth.css';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import logoMark from '../assets/landing/logo-mark.svg';
import illustration from '../assets/register/register-illustration.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [data, setData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    if (!data.email || !data.password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setButtonDisabled(true);
    try {
      const result = await loginUser(data);
      login(result.user.token);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      if (err instanceof TypeError) {
        setFormError('🔌 Network error, please try again later.');
      } else {
        setFormError('Invalid email or password. Please try again.');
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
          <h1 className="auth-heading">Welcome Back</h1>
          <p className="auth-subheading">Log in to continue your AI journey</p>

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            {formError && <p className="auth-form-error">{formError}</p>}

            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <div className="auth-input-wrap">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your email"
                  className={`auth-input ${formError ? 'has-error' : ''}`}
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your password"
                  className={`auth-input auth-input-password ${formError ? 'has-error' : ''}`}
                  value={data.password}
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
            </div>

            <div className="auth-row">
              <label className="auth-checkbox-label" htmlFor="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="auth-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <Link to="/forgot-password" className="auth-forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="auth-submit" disabled={buttonDisabled}>
              Log In
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </p>
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

      {success && <div className="auth-toast">Logged in successfully. Redirecting...</div>}
    </div>
  );
}
