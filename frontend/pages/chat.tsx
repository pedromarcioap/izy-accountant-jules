import { useState } from 'react';
import axios from 'axios';
import withAuth from '../components/withAuth';

function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  const onSend = async () => {
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);

    try {
      const response = await axios.post(
        'http://localhost:3001/proxy/openrouter',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: input }],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessages([
        ...newMessages,
        { sender: 'bot', text: response.data.choices[0].message.content },
      ]);
    } catch (error) {
      console.error(error);
    }

    setInput('');
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender}: </strong>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={onSend}>Send</button>
    </div>
  );
}

export default withAuth(Chat);
