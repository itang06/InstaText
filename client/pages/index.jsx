import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import MessageBubble from '../components/MessageBubble'
import ConnectionStatus from '../components/ConnectionStatus'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [users, setUsers] = useState([])
  const [me, setMe] = useState(null) // { id, username }
  const [peer, setPeer] = useState(null) // { id, username }
  const messagesEndRef = useRef(null)

  const API_URL = process.env.API_URL || 'http://localhost:4000/api'

  const upsertUser = async (username) => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
    if (!res.ok) throw new Error('Failed to upsert user')
    return res.json()
  }

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/users`)
    if (!res.ok) throw new Error('Failed to fetch users')
    const userList = await res.json()
    setUsers(userList)
    
    // Always use user ID 1 as "me" (hardcoded)
    if (!me) {
      setMe({ id: 1, username: 'You' })
    }
  }

  const selectPeer = (user) => {
    setPeer(user)
  }

  const loadConversation = async () => {
    if (!me?.id || !peer?.id) return
    const url = new URL(`${API_URL}/messages/conversation`)
    url.searchParams.set('userId', String(me.id))
    url.searchParams.set('peerId', String(peer.id))
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error('Failed to fetch conversation')
    const rows = await res.json()
    const mapped = rows.map(r => ({
      id: r.id,
      content: r.content,
      from: r.sender_id === me.id ? 'me' : 'peer',
      timestamp: new Date().toISOString(), // Use current time since no created_at column
      isOwn: r.sender_id === me.id
    }))
    setMessages(mapped)
  }

  useEffect(() => {
    fetchUsers().catch(console.error)
  }, [])

  useEffect(() => {
    if (me && peer) {
      loadConversation().catch(console.error)
    }
  }, [me, peer])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || !me?.id || !peer?.id) return

    const content = inputMessage.trim()

    // optimistic update
    const tempId = Date.now()
    setMessages(prev => [...prev, {
      id: tempId,
      content,
      from: 'me',
      timestamp: new Date().toISOString(),
      isOwn: true
    }])
    setInputMessage('')

    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: me.id, receiverId: peer.id, content })
      })
      if (!res.ok) throw new Error('Failed to send message')
      // reload conversation to get canonical IDs/order
      await loadConversation()
    } catch (e) {
      console.error(e)
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
            <button className="text-sm px-4 py-2 rounded-md border bg-gray-400 text-white">{"About"}</button>
          </div>
        </header>

        {/* Chat Container */}
        <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
          {/* User Selection */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-3">Click a user to start chatting:</h2>
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
                Chatting with: <span className="font-semibold">{peer.username}</span>
              </div>
            )}
          </div>
          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto messages-container p-4 space-y-4">
                {!peer ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p>Select a user above to start chatting!</p>
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
                placeholder={me && peer ? "Type a message..." : "Login and set peer first"}
                disabled={!me || !peer}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || !me || !peer}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}


