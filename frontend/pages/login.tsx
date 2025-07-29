import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const onLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      router.push('/');
    } catch (error) {
      setError('Invalid credentials!');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={onLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
}
