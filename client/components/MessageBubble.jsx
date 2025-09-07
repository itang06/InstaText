import React from 'react';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`message-bubble ${
          isOwn ? 'message-sent' : 'message-received'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;

