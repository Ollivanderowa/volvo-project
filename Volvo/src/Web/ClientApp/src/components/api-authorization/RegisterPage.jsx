import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PASSWORD_HINT =
  'At least 6 characters with uppercase, lowercase, a digit, and a special character (e.g. Test123!).';

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePassword(value) {
  return value.length >= 6
    && /[a-z]/.test(value)
    && /[A-Z]/.test(value)
    && /\d/.test(value)
    && /[^a-zA-Z0-9]/.test(value);
}

function formatRegisterError(err) {
  if (err?.errors) {
    return Object.values(err.errors).flat().join(' ');
  }
  if (typeof err?.detail === 'string' && err.detail) {
    return err.detail;
  }
  if (typeof err?.title === 'string' && err.title) {
    return err.title;
  }
  return 'Registration failed. Please try again.';
}

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const emailValid = validateEmail(email);
  const passwordValid = validatePassword(password);

  const emailInvalid = emailTouched ? !emailValid : undefined;
  const passwordInvalid = passwordTouched ? !passwordValid : undefined;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailTouched(true);
    setPasswordTouched(true);
    if (!emailValid || !passwordValid) return;
    try {
      await register(email, password);
      navigate('/login');
    } catch (err) {
      setError(formatRegisterError(err));
    }
  };

  return (
    <article>
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" autoComplete="username"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          aria-invalid={emailInvalid}
          aria-describedby="email-helper" />
        <small id="email-helper">
          {emailTouched && !emailValid ? 'Please enter a valid email address.' : ''}
        </small>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onBlur={() => setPasswordTouched(true)}
          aria-invalid={passwordInvalid}
          aria-describedby="password-helper" />
        <small id="password-helper">{PASSWORD_HINT}</small>
        <button type="submit">Register</button>
        <p style={{ marginTop: '1rem' }}>Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </article>
  );
}
