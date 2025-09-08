import React from 'react';

const About = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">About InstaText</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4 text-gray-700">
          <p>
            InstaText is a real-time chat application that allows users to send messages without having to create an account.
          </p>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Real-time messaging with WebSocket connections</li>
              <li>Minimalist UI built with React and Tailwind CSS</li>
              <li>Live WebSocket connection status indicator</li>
              <li>Responsive design for all devices</li>
              <li>PostgreSQL database for message persistence</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Tech Stack:</h3>
            <div className="text-sm">
              <p><strong>Frontend:</strong> React.js, Next.js, Tailwind CSS</p>
              <p><strong>Backend:</strong> Node.js, Express.js, WebSockets</p>
              <p><strong>Database:</strong> PostgreSQL</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
