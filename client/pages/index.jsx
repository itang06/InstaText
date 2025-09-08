import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import MessageBubble from '../components/MessageBubble'
import ConnectionStatus from '../components/ConnectionStatus'
import About from '../components/About'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [users, setUsers] = useState([])
  const [peer, setPeer] = useState(null) // { id, username }
  const [isConnected, setIsConnected] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const wsRef = useRef(null)

  const API_URL = process.env.API_URL || 'http://localhost:4000/api'


  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/users`)
    if (!res.ok) throw new Error('Failed to fetch users')
    const userList = await res.json()
    setUsers(userList)
    
  }

  const selectPeer = (user) => {
    setPeer(user)
  }

  const loadConversation = async () => {
    if (!peer?.id) return
    const url = new URL(`${API_URL}/messages/conversation`)
    url.searchParams.set('userId', '1')
    url.searchParams.set('peerId', String(peer.id))
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error('Failed to fetch conversation')
    const rows = await res.json()
    const mapped = rows.map(r => ({
      id: r.id,
      content: r.content,
      from: r.sender_id === 1 ? 'me' : 'peer',
      timestamp: new Date().toISOString(), // Use current time since no created_at column
      isOwn: r.sender_id === 1
    }))
    setMessages(mapped)
  }

  useEffect(() => {
    fetchUsers().catch(console.error)
  }, [])

  useEffect(() => {
    if (peer) {
      loadConversation().catch(console.error)
    }
  }, [peer])

  // WebSocket connection
  const connectWebSocket = () => {
    try {
      console.log('Attempting to connect to WebSocket')
      wsRef.current = new WebSocket('ws://localhost:4000')
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully')
        setIsConnected(true)
      }
      
      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
      }
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('Received WebSocket message:', data)
          
          // Handle chat messages
          if (data.type === 'chat') {
            console.log('Processing chat message:', {
              from: data.from,
              to: data.to,
              me: 1,
              peer: peer?.id,
              content: data.content
            })
            
            // Add message if it's for the current conversation
            if (peer && (
              (data.from === peer.id && data.to === 1) || // Message TO me FROM peer
              (data.from === 1 && data.to === peer.id)    // Message FROM me TO peer
            )) {
              console.log('✅ Adding message to conversation')
              setMessages(prev => [...prev, {
                id: Date.now() + Math.random(),
                content: data.content,
                from: data.from === 1 ? 'me' : 'peer',
                timestamp: data.timestamp,
                isOwn: data.from === 1
              }])
            } else {
              console.log('Message not for current conversation')
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        console.error('Error details:', error.type, error.target?.readyState)
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setIsConnected(false)
    }
  }

  useEffect(() => {
    // Test server connectivity first
    const testServerConnection = async () => {
      try {
        console.log('🔍 Testing server connection...')
        const response = await fetch('http://localhost:4000/health')
        if (response.ok) {
          console.log('Server is reachable, connecting WebSocket')
          connectWebSocket()
        } else {
          console.log('Server responded with error:', response.status)
          setIsConnected(false)
        }
      } catch (error) {
        console.log('Server is not reachable:', error.message)
        console.log('Will retry WebSocket connection anyway...')
        connectWebSocket()
      }
    }

    testServerConnection()

    // Cleanup when component unmounts
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting') // Manual close
      }
    }
  }, []) // Empty dependency array - only run once on mount

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || !peer?.id) return

    const content = inputMessage.trim()

    // Send via WebSocket for real-time delivery
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat',
        content: content,
        from: 1,
        to: peer.id
      }))
    }

    // Add to local messages immediately (optimistic update)
    setMessages(prev => [...prev, {
      id: Date.now(),
      content,
      from: 'me',
      timestamp: new Date().toISOString(),
      isOwn: true
    }])
    setInputMessage('')

    // Also save to database
    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: 1, receiverId: peer.id, content })
      })
      if (!res.ok) throw new Error('Failed to send message')
    } catch (e) {
      console.error('Failed to save message to database:', e)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <Head>
        <title>InstaText - Real-time Chat</title>
        <meta name="description" content="A minimal full-stack chat application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">InstaText</h1>
            <div className="flex items-center space-x-4">
              <ConnectionStatus isConnected={isConnected} />
              <button 
                onClick={() => setIsAboutOpen(true)}
                className="text-sm px-4 py-2 rounded-md border bg-gray-400 text-white hover:bg-gray-500 transition-colors"
              >
                About
              </button>
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
          {/* User Selection */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-3">Click a user to start texting:</h2>
            <div className="flex flex-wrap gap-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => selectPeer(user)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    peer?.id === user.id
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {user.username}
                </button>
              ))}
            </div>
            {peer && (
              <div className="mt-3 text-sm text-gray-600">
                Texting with: <span className="font-semibold">{peer.username}</span>
              </div>
            )}
          </div>
          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto messages-container p-4 space-y-4">
                {!peer ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p>Select a user above to start texting!</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.isOwn}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={peer ? "Type a message..." : "Choose a user to chat with..."}
                disabled={!peer}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || !peer}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </main>
        
        {/* About */}
        <About 
          isOpen={isAboutOpen} 
          onClose={() => setIsAboutOpen(false)} 
        />
      </div>
    </>
  )
}


