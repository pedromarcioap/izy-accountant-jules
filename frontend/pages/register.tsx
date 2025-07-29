import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const onRegister = async () => {
    try {
      await axios.post('http://localhost:3001/auth/register', { email, password });
      router.push('/login');
    } catch (error) {
      setError('User already exists!');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={onRegister}>Register</button>
      {error && <p>{error}</p>}
    </div>
  );
}
