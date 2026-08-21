import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Onboarding.css';
import logoMark from '../assets/landing/logo-mark.svg';
import { completeOnboarding } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { ROLE_OPTIONS, FIELD_OPTIONS, GOAL_OPTIONS } from '../constants/profileOptions';

const STEPS = ['Welcome', 'Basic Information', 'Finish'];

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 3.5 10.5 8 6 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 3.5 5.5 8 10 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SelectChevron() {
  return (
    <svg className="onboarding-select-chevron" width="10" height="5" viewBox="0 0 10 5" fill="none">
      <path
        d="M1 1l4 3 4-3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { token, hasCompletedOnboarding, login } = useAuth();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');
  const [field, setField] = useState('');
  const [goal, setGoal] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // a user who already completed onboarding shouldn't land back on this page
  useEffect(() => {
    if (hasCompletedOnboarding) {
      navigate('/dashboard', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleNext() {
    if (!role || !field || !goal) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setSubmitError(null);

    if (!token) {
      setSubmitError('You must be logged in to continue.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await completeOnboarding({ role, field, goal }, token);
      login(result.user.token);
      setStep(2);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="onboarding-page">
      <aside className="onboarding-sidebar">
        <Link to="/" className="onboarding-logo">
          <img src={logoMark} alt="" />
          <span>CareerMate AI</span>
        </Link>

        <ul className="onboarding-steps">
          {STEPS.map((label, index) => (
            <li key={label}>
              <div className={`onboarding-step ${index <= step ? 'is-active' : ''}`}>
                <span className="onboarding-step-circle">{index + 1}</span>
                <span className="onboarding-step-label">{label}</span>
              </div>
              {index < STEPS.length - 1 && <div className="onboarding-step-connector" />}
            </li>
          ))}
        </ul>
      </aside>

      <main className="onboarding-content">
        {step === 0 && (
          <div className="onboarding-hero">
            <h1>Welcome to CareerMate AI !</h1>
            <p>Let AI guide your job preparation and growth.</p>
            <button
              type="button"
              className="onboarding-btn onboarding-btn-primary"
              onClick={() => setStep(1)}
            >
              Start Setup
              <ChevronRight />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="onboarding-form">
            <h2>Basic Information</h2>

            <div className="onboarding-fields">
              <div className="onboarding-field">
                <label htmlFor="role">Your Role</label>
                <div className="onboarding-select-wrap">
                  <select
                    id="role"
                    className={`onboarding-select ${showErrors && !role ? 'has-error' : ''}`}
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="" disabled hidden>
                      Selected
                    </option>
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
              </div>

              <div className="onboarding-field">
                <label htmlFor="field">Your Field</label>
                <div className="onboarding-select-wrap">
                  <select
                    id="field"
                    className={`onboarding-select ${showErrors && !field ? 'has-error' : ''}`}
                    required
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                  >
                    <option value="" disabled hidden>
                      Selected
                    </option>
                    {FIELD_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
              </div>

              <div className="onboarding-field">
                <label htmlFor="goal">Your Goal</label>
                <div className="onboarding-select-wrap">
                  <select
                    id="goal"
                    className={`onboarding-select ${showErrors && !goal ? 'has-error' : ''}`}
                    required
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  >
                    <option value="" disabled hidden>
                      Selected
                    </option>
                    {GOAL_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
              </div>
            </div>

            {submitError && <p className="onboarding-error">{submitError}</p>}

            <div className="onboarding-actions">
              <button
                type="button"
                className="onboarding-btn onboarding-btn-ghost"
                onClick={() => setStep(0)}
                disabled={submitting}
              >
                <ChevronLeft />
                Back
              </button>
              <button
                type="button"
                className="onboarding-btn onboarding-btn-dark"
                onClick={handleNext}
                disabled={submitting}
              >
                {submitting ? 'Saving…' : 'Next'}
                <ChevronRight />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-hero">
            <h1>Setup Complete !</h1>
            <p>You&apos;re all set to start your AI career journey.</p>
            <button
              type="button"
              className="onboarding-btn onboarding-btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
              <ChevronRight />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
