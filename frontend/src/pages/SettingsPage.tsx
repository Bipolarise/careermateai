import { Link, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import './Onboarding.css';
import logoMark from '../assets/landing/logo-mark.svg';
import { updateProfile } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { ROLE_OPTIONS, FIELD_OPTIONS, GOAL_OPTIONS } from '../constants/profileOptions';

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

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, token, login } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [role, setRole] = useState(user?.role ?? '');
  const [field, setField] = useState(user?.field ?? '');
  const [goal, setGoal] = useState(user?.goal ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    if (!token) return;

    setSubmitting(true);
    try {
      const result = await updateProfile({ fullName, role, field, goal }, token);
      login(result.user.token);
      toast.success('Settings updated.');
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
        <Link to="/dashboard" className="onboarding-logo">
          <img src={logoMark} alt="" />
          <span>CareerMate AI</span>
        </Link>
      </aside>

      <main className="onboarding-content">
        <form className="onboarding-form" onSubmit={handleSubmit}>
          <h2>Personal Settings</h2>

          <div className="onboarding-fields">
            <div className="onboarding-field">
              <label htmlFor="email">Email</label>
              <div className="onboarding-select-wrap">
                <input
                  id="email"
                  className="onboarding-select"
                  value={user?.email ?? ''}
                  disabled
                />
              </div>
            </div>

            <div className="onboarding-field">
              <label htmlFor="fullName">Full Name</label>
              <div className="onboarding-select-wrap">
                <input
                  id="fullName"
                  className="onboarding-select"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="onboarding-field">
              <label htmlFor="role">Your Role</label>
              <div className="onboarding-select-wrap">
                <select
                  id="role"
                  className="onboarding-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
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
                  className="onboarding-select"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                >
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
                  className="onboarding-select"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
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
              onClick={() => navigate('/dashboard')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="onboarding-btn onboarding-btn-dark"
              disabled={submitting}
            >
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
