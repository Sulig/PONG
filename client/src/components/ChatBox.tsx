import { useState } from 'react';
import type { Message } from '../types';
import SendIcon from './icons/SendIcon';

const ChatBox = () => {
  const [messages] = useState<Message[]>([
    { id: 1, text: 'Hi!', sender: 'user' },
    { id: 2, text: 'Hello!', sender: 'opponent' },
  ]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages area */}
      <div className="flex-1 bg-white/5 rounded-t-lg p-4 overflow-y-auto">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-accent-purple/20 text-text-primary'
                    : 'bg-white/10 text-text-primary'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message input area */}
      <div className="bg-white/5 rounded-b-lg p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message"
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-purple text-text-primary placeholder:text-text-muted"
          />
          <div className="flex gap-2">
	          <button
              className="p-2 bg-accent-purple/20 hover:bg-accent-purple/30 rounded-full transition"
              title="Send message"
            >
              <SendIcon className="h-5 w-5 text-accent-purple" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
