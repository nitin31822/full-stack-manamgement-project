import React from 'react';
import { IMessage } from '@/types/ApiResponse';
import dayjs from 'dayjs';

const Message = ({ message, isOwner }: { message: IMessage; isOwner: boolean }) => {
  const createdTime = dayjs(message.createdAt).format('MMM D, YYYY h:mm A')
  return (
    <div className={`mb-2 ${isOwner ? 'text-right' : 'text-left'} break-words`}>
      <div className={`flex ${isOwner ? 'justify-end' : 'justify-start'} items-center mb-1`}>
        <span className="text-sm text-gray-600">{message.sender.name}</span>
        <span className="text-xs text-gray-500 ml-2">{createdTime}</span>
      </div>
      <p
        className={`inline-block px-4 py-2 rounded-lg break-words ${
          isOwner ? 'bg-blue-500 text-white' : 'bg-gray-400 text-black'
        }`}
      >
        {message.content}
      </p>
    </div>
  );
};

export default Message;
