import { useState, type FormEvent } from 'react';
import './RegisterPage.css';

export default function JDPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage('');

    if (!jobDescription.trim()) {
      setError('Please paste a job description');
      return;
    }

    setError('');
    setSuccessMessage('Job description submitted!');
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Job Description</h1>
        <p className="register-subtitle">Paste the job description you&apos;d like to analyze</p>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="jobDescription">Job description</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              rows={10}
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              className={error ? 'input-error' : ''}
            />
            {error && <span className="field-error">{error}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-register">
              Submit
            </button>
          </div>
        </form>

        {successMessage && <p className="register-success">{successMessage}</p>}
      </div>
    </div>
  );
}
