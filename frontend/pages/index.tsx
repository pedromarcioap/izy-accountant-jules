import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import withAuth from '../components/withAuth';

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const onUpload = async () => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('month', month);
    formData.append('year', year);
    formData.append('userId', 'clx5b7p8v0000z0z0z0z0z0z0'); // Replace with actual user ID

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage('File upload failed!');
    }
  };

  return (
    <div>
      <Link href="/dashboard">
        <a>Dashboard</a>
      </Link>
      <Link href="/chat">
        <a>Chat</a>
      </Link>
      <h1>Upload Statement</h1>
      <input type="file" onChange={onFileChange} />
      <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month" />
      <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
      <button onClick={onUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default withAuth(Home);
