import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail } from '../utils/validation';
import logoMark from '../assets/landing/logo-mark.svg';
import heroRobot from '../assets/landing/hero-robot.png';
import chatMockup from '../assets/landing/chat-mockup.png';
import careerCoachIllustration from '../assets/landing/career-coach-illustration.svg';
import resumeAnalyzerIllustration from '../assets/landing/resume-analyzer-illustration.svg';
import projectReviewerIllustration from '../assets/landing/project-reviewer-illustration.svg';
import techLogoDiamond from '../assets/landing/tech-logo-diamond.svg';
import './LandingPage.css';

const problems = [
  'Your resume keeps getting ignored.',
  "You don't know what interviewers expect.",
  "You're unsure how to plan your career.",
];

const features = [
  {
    title: 'AI Mock Interview',
    description: 'Practice real interview questions and get instant feedback.',
    illustration: null,
  },
  {
    title: 'Career Coach Mode',
    description: 'Discover your ideal job path and skill roadmap.',
    illustration: careerCoachIllustration,
  },
  {
    title: 'Resume Analyzer',
    description: 'Upload your resume, and get improvement tips instantly.',
    illustration: resumeAnalyzerIllustration,
  },
  {
    title: 'Project Reviewer',
    description: 'Let AI turn your past projects into strong interview stories.',
    illustration: projectReviewerIllustration,
  },
];

const testimonials = [
  {
    quote:
      'CareerMate AI helped me improve my resume and confidence — I landed my first software internship!',
    name: 'Emily',
    school: 'University of Sydney',
  },
  {
    quote: 'The AI mock interviews were just like the real thing.',
    name: 'Jason',
    school: 'UNSW Graduate',
  },
];

const roleOptions = ['Student', 'Graduate', 'Career Switcher', 'Other'];
const fieldOptions = ['Software Engineering', 'Data Science', 'Design', 'Other'];

type ContactFieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export default function LandingPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [field, setField] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  function validateContactForm(): ContactFieldErrors {
    const nextErrors: ContactFieldErrors = {};
    const emailError = validateEmail(email);

    if (!name.trim()) nextErrors.name = 'Full name is required';
    if (emailError) nextErrors.email = emailError;
    if (!message.trim()) nextErrors.message = 'Message is required';

    return nextErrors;
  }

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage('');

    const nextErrors = validateContactForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSuccessMessage("Thanks for reaching out! We'll get back to you soon.");
    setName('');
    setEmail('');
    setRole('');
    setField('');
    setMessage('');
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link to="/" className="landing-logo">
            <img src={logoMark} alt="" className="landing-logo-mark" />
            <span>CareerMate AI</span>
          </Link>
          <nav className="landing-nav">
            <a href="#demo" className="landing-nav-pill">
              Demo
            </a>
            <a href="#features" className="landing-nav-pill">
              Features
            </a>
            <Link to="/login" className="landing-nav-pill">
              Sign In
            </Link>
            <Link to="/register" className="landing-nav-pill landing-nav-pill-primary">
              Start for Free
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <img src={heroRobot} alt="" className="landing-hero-robot" />
          <h1 className="landing-hero-title">Your AI Career Practice Partner</h1>
          <p className="landing-hero-subtitle">
            Get job-ready with AI — from resumes to interviews,
            <br />
            CareerMate AI coaches you step by step.
          </p>
          <div className="landing-hero-buttons">
            <Link to="/register" className="btn-landing-primary">
              Start for Free
            </Link>
            <a href="#demo" className="btn-landing-secondary">
              Watch Demo
            </a>
          </div>

          <div className="landing-preview-row">
            <div className="landing-preview-card">
              <h3>Interview with CareerMate AI</h3>
              <p>Practice real interview questions and get instant feedback</p>
              <div className="landing-preview-chat">
                <div className="chat-bubble chat-bubble-ai">Can I help you?</div>
                <div className="chat-bubble chat-bubble-user">
                  Can you help me prepare for a frontend interview?
                </div>
              </div>
            </div>

            <img
              src={chatMockup}
              alt="CareerMate AI chat interface"
              className="landing-preview-card landing-preview-center"
            />

            <div className="landing-preview-card">
              <h3>Chat with any Resume</h3>
              <p>Revamp your resume with CareerMate AI</p>
              <p className="landing-preview-hint">
                Please Ensure your resume Contains text and is under 10 MB
              </p>
            </div>
          </div>
        </section>

        <section className="landing-problems">
          <h2>Still Struggling with Job Applications?</h2>
          <div className="landing-problems-card">
            <p className="landing-problems-lead">
              CareerMate AI helps you fix all of that — smartly.
            </p>
            <ul className="landing-problems-list">
              {problems.map((problem) => (
                <li key={problem}>
                  <span className="landing-problem-dot" />
                  {problem}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="features" className="landing-features">
          <h2>Everything You Need to Grow Your Career</h2>
          <div className="landing-features-grid">
            {features.map((feature) => (
              <div className="landing-feature-card" key={feature.title}>
                {feature.illustration ? (
                  <img src={feature.illustration} alt="" className="landing-feature-illustration" />
                ) : (
                  <div className="landing-feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#3266ff" strokeWidth="1.5">
                      <path
                        d="M12 15a4 4 0 0 0 4-4V6a4 4 0 1 0-8 0v5a4 4 0 0 0 4 4Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 11a6 6 0 0 0 12 0M12 17v3m-3 0h6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="demo" className="landing-demo">
          <h2>See CareerMate AI in Action</h2>
          <div className="landing-browser-mockup">
            <div className="landing-browser-bar">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="landing-browser-chat-header">
              <img src={logoMark} alt="" className="landing-logo-mark" />
              <div>
                <strong>CareerMate AI Assistant</strong>
                <span className="landing-online">
                  <span className="landing-online-dot" /> Online
                </span>
              </div>
            </div>
            <div className="landing-browser-chat-body">
              <div className="chat-bubble chat-bubble-ai">Can I help you?</div>
              <div className="chat-bubble chat-bubble-ai">
                Sure! Let&apos;s start with HTML/CSS fundamentals.
                <br />
                What do you know about Flexbox and Grid layouts?
              </div>
              <div className="chat-bubble chat-bubble-user">
                Can you help me prepare for a frontend interview?
              </div>
            </div>
            <div className="landing-browser-chat-input">
              <span>Type your question…</span>
            </div>
          </div>
          <p className="landing-demo-badge">CareerMate AI · CareerMate AI ·</p>
        </section>

        <section className="landing-tech">
          <h2>Built with the Power of AI Engineering</h2>
          <p>
            Powered by OpenAI GPT models, LangChain, and AWS Cloud.
            <br />
            Developed by JR Academy&apos;s AI Engineering program — where learning meets innovation.
          </p>
          <div className="landing-tech-logos">
            <span className="landing-tech-bubble landing-tech-bubble-orange">AI</span>
            <span className="landing-tech-bubble landing-tech-bubble-dark">
              <img src={techLogoDiamond} alt="" className="landing-tech-bubble-diamond" />
            </span>
            <span className="landing-tech-bubble landing-tech-bubble-navy">AWS</span>
          </div>
        </section>

        <section className="landing-testimonials">
          <h2>Trusted by Students Worldwide</h2>
          <div className="landing-testimonials-grid">
            {testimonials.map((testimonial) => (
              <div className="landing-testimonial-card" key={testimonial.name}>
                <p className="landing-testimonial-quote">&quot;{testimonial.quote}&quot;</p>
                <div className="landing-testimonial-author">
                  <span className="landing-avatar">{testimonial.name[0]}</span>
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.school}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-cta">
          <h2>Ready to level up your career?</h2>
          <p>
            Start your AI-powered journey today.
            <br />
            It&apos;s free, smart, and made for you.
          </p>
          <Link to="/register" className="btn-landing-cta">
            Start Practicing for Free
          </Link>
        </section>

        <section id="contact" className="landing-contact">
          <div className="landing-contact-info">
            <h2>
              Get in
              <br />
              touch with us
            </h2>
            <p>
              We&apos;re here to help! Whether you have a question about our services, need
              assistance with your account, or want to provide feedback, our team is ready to assist
              you.
            </p>
            <div className="landing-contact-detail">
              <span className="landing-contact-label">Email:</span>
              <span>Hello@careermate.com</span>
            </div>
            <div className="landing-contact-detail">
              <span className="landing-contact-label">Phone:</span>
              <span>+61 123456789</span>
            </div>
            <p className="landing-contact-hours">Available Monday to Friday, 9 AM - 6 PM GMT</p>
          </div>

          <form className="landing-contact-form" onSubmit={handleContactSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="contact-name">Full Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="landing-contact-form-row">
              <div className="form-field">
                <label htmlFor="contact-role">Your Role</label>
                <select
                  id="contact-role"
                  name="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  <option value="">Selected</option>
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="contact-field">Your Field</label>
                <select
                  id="contact-field"
                  name="field"
                  value={field}
                  onChange={(event) => setField(event.target.value)}
                >
                  <option value="">Selected</option>
                  {fieldOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="contact-message">How can we help you?</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Enter your message..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className={errors.message ? 'input-error' : ''}
              />
              {errors.message && <span className="field-error">{errors.message}</span>}
            </div>

            <button type="submit" className="btn-landing-send">
              Send Message
            </button>

            {successMessage && <p className="landing-contact-success">{successMessage}</p>}
          </form>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-links">
          <Link to="/terms">Terms</Link>
          <Link to="/terms">Privacy</Link>
          <a href="#contact">Contact</a>
        </div>
        <p className="landing-footer-copyright">© 2025 CareerMate AI by JR Academy</p>
        <p className="landing-footer-brand">JR Academy</p>
      </footer>
    </div>
  );
}
