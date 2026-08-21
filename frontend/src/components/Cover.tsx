import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type CoverProps = {
  title?: string;
  description?: ReactNode;
};

const defaultDescription = (
  <>
    Get job-ready with AI — from resumes to interviews,
    <br />
    CareerMate AI coaches you step by step.
  </>
);

export default function Cover({
  title = 'Your AI Career Practice Partner',
  description = defaultDescription,
}: CoverProps) {
  return (
    <main>
      <div className="cover">
        <h1 className="cover-title">{title}</h1>
        <p className="cover-description">{description}</p>
        <div className="cover-buttons">
          <Link to="/register" className="btn-cover-primary">
            Start for Free
          </Link>
          <a href="#demo" className="btn-cover-secondary">
            Watch Demo
          </a>
        </div>
      </div>
    </main>
  );
}
