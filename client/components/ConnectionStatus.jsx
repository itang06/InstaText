import React from 'react';

const ConnectionStatus = ({ isConnected }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="text-sm text-gray-600">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};

export default ConnectionStatus;

