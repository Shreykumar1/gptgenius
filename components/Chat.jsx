'use client';
import { generateChatResponse } from '@/utils/action';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { SiOpenaigym } from 'react-icons/si';
import Markdown from 'react-markdown'





const Chat = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  const { mutate, isPending } = useMutation({
    mutationFn: (query) => generateChatResponse([...messages, query]),

    onSuccess: (data) => {
      const resp = {
        role: "model",
        parts: [{ text: data }],
      }
      setMessages((prev) => [...prev, resp]);
    },
    onError: (error) => {
      console.log(error);
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(text);
    const query = {
      role: "user",
      parts: [{ text: text }],
    }
    mutate(query);
    setMessages([...messages, query])
    console.log(messages);
    setText('')
  }


  return (
    <div className='min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]'>
      {messages.length===0? <div className='grid place-items-center max-w-3xl'>
        <SiOpenaigym className='w-24 h-24 text-primary ' />
      </div>: ''}
      <div>
        {messages.map(({ role, parts }, index) => {
          const avatar = role == 'user' ? '👤' : '🤖';
          const bcg = role == 'user' ? 'bg-base-200' : 'bg-base-100';
          return (
            <div
              key={index}
              className={` ${bcg} flex py-6 -mx-8 px-8
               text-md leading-loose border-b border-base-300`}
            >
              <span className='mr-4 '>{avatar}</span>
              <p className='max-w-3xl'><Markdown>{parts[0].text}</Markdown></p>
            </div>
          );
        })}
        {isPending && <span className='loading'></span>}
      </div>


      <form onSubmit={handleSubmit} className='max-w-4xl pt-12'>
        <div className='join w-full'>
          <input
            type='text'
            placeholder='Message GeniusGPT'
            className='input input-bordered join-item w-full'
            value={text}
            required
            onChange={(e) => setText(e.target.value)}
          />
          <button className='btn btn-primary join-item' type='submit'>
            ask question
          </button>
        </div>
      </form>
    </div>
  );
};
export default Chat;