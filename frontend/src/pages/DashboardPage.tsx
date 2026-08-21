import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logoMark from '../assets/landing/logo-mark.svg';
import { useAuth } from '../context/AuthContext';
import { fetchMyJDs, submitJobDescription, type JD } from '../api/jd';
import './DashboardPage.css';

type ResumeStatus = 'empty' | 'uploading' | 'uploaded';

type ChatMessage = {
  id: number;
  sender: 'user' | 'ai';
  text: string;
};

const USER_EMAIL = 'youremail@email.com';

const MAX_RESUME_SIZE = 10 * 1024 * 1024; // 10 MB

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5v8M8 9.5 4.667 6.167M8 9.5l3.333-3.333"
        stroke="#5C5C5C"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.667 11.5v1.333A1.167 1.167 0 0 0 3.833 14h8.334a1.167 1.167 0 0 0 1.166-1.167V11.5"
        stroke="#5C5C5C"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 12.5V3.333M10 3.333 6.667 6.667M10 3.333l3.333 3.334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.333 13.333v1.334A2.333 2.333 0 0 0 5.667 17h8.666a2.333 2.333 0 0 0 2.334-2.333v-1.334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocumentIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 2.5h8.5L19 7v13.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14.5 2.5V7H19" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 1l10 10M11 1 1 11" stroke="#5C5C5C" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 12.7a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z"
        stroke="#161616"
        strokeWidth="1.4"
      />
      <path
        d="M16.2 12.4a1.35 1.35 0 0 0 .27 1.49l.05.05a1.64 1.64 0 1 1-2.32 2.32l-.05-.05a1.35 1.35 0 0 0-1.49-.27 1.35 1.35 0 0 0-.82 1.24v.14a1.64 1.64 0 1 1-3.28 0v-.08a1.35 1.35 0 0 0-.88-1.23 1.35 1.35 0 0 0-1.49.27l-.05.05a1.64 1.64 0 1 1-2.32-2.32l.05-.05a1.35 1.35 0 0 0 .27-1.49 1.35 1.35 0 0 0-1.24-.82h-.14a1.64 1.64 0 1 1 0-3.28h.08a1.35 1.35 0 0 0 1.23-.88 1.35 1.35 0 0 0-.27-1.49l-.05-.05A1.64 1.64 0 1 1 5.86 3.6l.05.05a1.35 1.35 0 0 0 1.49.27h.06a1.35 1.35 0 0 0 .82-1.24v-.14a1.64 1.64 0 1 1 3.28 0v.08a1.35 1.35 0 0 0 .82 1.23 1.35 1.35 0 0 0 1.49-.27l.05-.05a1.64 1.64 0 1 1 2.32 2.32l-.05.05a1.35 1.35 0 0 0-.27 1.49v.06a1.35 1.35 0 0 0 1.24.82h.14a1.64 1.64 0 1 1 0 3.28h-.08a1.35 1.35 0 0 0-1.23.82Z"
        stroke="#161616"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M8.333 17.5H4.667A1.667 1.667 0 0 1 3 15.833V4.167A1.667 1.667 0 0 1 4.667 2.5h3.666"
        stroke="#161616"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.333 14.167 17.5 10l-4.167-4.167M17.5 10H8.333"
        stroke="#161616"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="4.5" width="13" height="9" rx="1.5" stroke="#5C5C5C" strokeWidth="1.3" />
      <path
        d="M5.5 4.5V3a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 10.5 3v1.5"
        stroke="#5C5C5C"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 1.5v13" stroke="#5C5C5C" strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M3.5 2.5h7.5l-2 3 2 3h-7.5"
        stroke="#5C5C5C"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="#5C5C5C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 1 11 7 17 9 11 11 9 17 7 11 1 9 7 7 9 1Z" fill="#fff" />
    </svg>
  );
}

function BotAvatar() {
  return (
    <div className="dashboard-avatar dashboard-avatar-bot">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1 9.6 6.4 15 8l-5.4 1.6L8 15l-1.6-5.4L1 8l5.4-1.6L8 1Z" fill="#fff" />
      </svg>
    </div>
  );
}

let messageId = 0;
function nextId() {
  messageId += 1;
  return messageId;
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const userName = user?.fullName || '';
  const userField = user?.field || '';
  const userGoal = user?.goal || '';

  const [resumeStatus, setResumeStatus] = useState<ResumeStatus>('empty');
  const [resumeFileName, setResumeFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resumeHovered, setResumeHovered] = useState(false);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [jds, setJds] = useState<JD[]>([]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchMyJDs(token)
      .then(setJds)
      .catch(() => toast.error("Couldn't load your saved resumes."));
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (uploadTimerRef.current) window.clearInterval(uploadTimerRef.current);
    };
  }, []);

  useEffect(() => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isThinking]);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const { target } = event;
    const file = target.files?.[0];
    target.value = '';
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      toast.error('Support only PDF file.');
      return;
    }
    if (file.size > MAX_RESUME_SIZE) {
      toast.error('The file is too large. Please compress it before uploading.');
      return;
    }

    setResumeFileName(file.name);
    setResumeStatus('uploading');
    setUploadProgress(0);

    uploadTimerRef.current = window.setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + Math.round(10 + Math.random() * 20);
        if (next >= 100) {
          if (uploadTimerRef.current) window.clearInterval(uploadTimerRef.current);
          setResumeStatus('uploaded');
          return 100;
        }
        return next;
      });
    }, 250);
  }

  function handleDeleteResume() {
    setResumeStatus('empty');
    setResumeFileName('');
    setUploadProgress(0);
    setResumeHovered(false);
  }

  async function handleSend() {
    const text = inputValue.trim();
    if (!text || isThinking || !token) return;

    const userMessage: ChatMessage = { id: nextId(), sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    try {
      const newJD = await submitJobDescription(text, token);
      setJds((prev) => [newJD, ...prev]);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          sender: 'ai',
          text: newJD.generatedResume || "Here's your tailored resume.",
        },
      ]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate resume.');
    } finally {
      setIsThinking(false);
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleLogout() {
    setProfileMenuOpen(false);
    logout();
    navigate('/login');
  }

  function handleOpenSettings() {
    setProfileMenuOpen(false);
    navigate('/settings');
  }

  function handleDownloadJD(jd: JD) {
    const blob = new Blob([JSON.stringify(jd, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${jd.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const hasConversation = messages.length > 0 || isThinking;

  const chatInput = (
    <div className={`dashboard-chat-input ${inputValue ? 'has-content' : ''}`}>
      <textarea
        rows={5}
        placeholder="Type your question…"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleInputKeyDown}
      />
      <div className="dashboard-chat-input-actions">
        <button type="button" className="dashboard-icon-btn" aria-label="Attach">
          <PlusIcon />
        </button>
        <button
          type="button"
          className="dashboard-icon-btn dashboard-icon-btn-send"
          aria-label="Send message"
          onClick={handleSend}
          disabled={!inputValue.trim() || isThinking}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-logo">
          <img src={logoMark} alt="" />
          <span>CareerMate AI</span>
        </Link>

        <div className="dashboard-resume-section">
          <h2>My Resume</h2>

          {resumeStatus === 'empty' ? (
            <div className="dashboard-resume-empty">
              <button type="button" className="dashboard-upload-btn" onClick={handleUploadClick}>
                <UploadIcon />
                Upload Resume
              </button>
              <p>PDF only, up to 10 MB</p>
            </div>
          ) : (
            <div
              className="dashboard-resume-file"
              onMouseEnter={() => setResumeHovered(true)}
              onMouseLeave={() => setResumeHovered(false)}
            >
              <DocumentIcon color={resumeStatus === 'uploading' ? '#3266FF' : '#B5B5B5'} />
              <div className="dashboard-resume-file-info">
                <span className="dashboard-resume-file-name">{resumeFileName}</span>
                {resumeStatus === 'uploading' && (
                  <div className="dashboard-resume-progress">
                    <div className="dashboard-resume-progress-track">
                      <div
                        className="dashboard-resume-progress-fill"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span>{uploadProgress}%</span>
                  </div>
                )}
              </div>
              {resumeStatus === 'uploaded' && resumeHovered && (
                <button
                  type="button"
                  className="dashboard-resume-delete"
                  aria-label="Delete resume"
                  onClick={handleDeleteResume}
                >
                  <DeleteIcon />
                </button>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="dashboard-file-input"
            onChange={handleFileChange}
          />

          {jds.length > 0 && (
            <ul className="dashboard-jd-list">
              {jds.map((jd) => (
                <li key={jd._id} className="dashboard-jd-list-item">
                  <DocumentIcon color="#B5B5B5" />
                  <span className="dashboard-jd-list-title" title={jd.title}>
                    {jd.title}
                  </span>
                  <button
                    type="button"
                    className="dashboard-jd-list-download"
                    aria-label={`Download ${jd.title} as JSON`}
                    onClick={() => handleDownloadJD(jd)}
                  >
                    <DownloadIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-profile-card">
          <div className="dashboard-profile-card-header">
            <div className="dashboard-avatar dashboard-avatar-user" />
            <span>{userName}</span>
          </div>
          <div className="dashboard-profile-card-body">
            <div className="dashboard-profile-row">
              <BriefcaseIcon />
              <span className="dashboard-profile-label">Your field:</span>
              <span className="dashboard-profile-value">{userField}</span>
            </div>
            <div className="dashboard-profile-row">
              <FlagIcon />
              <span className="dashboard-profile-label">Goal:</span>
              <span className="dashboard-profile-value">{userGoal}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar" ref={profileMenuRef}>
          <button
            type="button"
            className="dashboard-avatar dashboard-avatar-user dashboard-avatar-btn"
            aria-label="Open profile menu"
            onClick={() => setProfileMenuOpen((open) => !open)}
          />
          {profileMenuOpen && (
            <div className="dashboard-profile-menu">
              <p className="dashboard-profile-menu-email">{USER_EMAIL}</p>
              <div className="dashboard-profile-menu-divider" />
              <button
                type="button"
                className="dashboard-profile-menu-item"
                onClick={handleOpenSettings}
              >
                <GearIcon />
                Personal Settings
              </button>
              <button type="button" className="dashboard-profile-menu-item" onClick={handleLogout}>
                <LogoutIcon />
                Logout
              </button>
            </div>
          )}
        </div>

        {hasConversation ? (
          <div className="dashboard-chat-thread" ref={threadRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`dashboard-message dashboard-message-${message.sender}`}
              >
                {message.sender === 'user' ? (
                  <div className="dashboard-avatar dashboard-avatar-user" />
                ) : (
                  <BotAvatar />
                )}
                <div className="dashboard-message-body">
                  <span className="dashboard-message-sender">
                    {message.sender === 'user' ? 'You' : 'CareerMate AI'}
                  </span>
                  <div className="dashboard-message-bubble">{message.text}</div>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="dashboard-message dashboard-message-ai">
                <BotAvatar />
                <div className="dashboard-message-body">
                  <span className="dashboard-message-sender">CareerMate AI</span>
                  <div className="dashboard-message-bubble dashboard-message-bubble-thinking">
                    AI is thinking…
                  </div>
                </div>
              </div>
            )}
            <div className="dashboard-chat-input-pinned">{chatInput}</div>
          </div>
        ) : (
          <div className="dashboard-empty-state">
            <h1>Hi, {userName} 👋</h1>
            <p>I&apos;m here to help with your resume, interviews, and career planning.</p>
            {chatInput}
          </div>
        )}
      </main>
    </div>
  );
}
