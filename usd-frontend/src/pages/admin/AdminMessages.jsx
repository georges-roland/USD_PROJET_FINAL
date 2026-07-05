import { useState, useEffect, useRef } from 'react';
import { api, useAuth } from '../../context/AuthContext';
import { Inbox, Send, Shield, User } from 'lucide-react';

const translations = {
  fr: {
    inbox: "Conversations Clients",
    noMessages: "Aucune conversation",
    panelHeader: "Chat de Vente & Support",
    from: "Client :",
    received: "Reçu le",
    replyPlaceholder: "Écrire une réponse pour finaliser l'achat...",
    selectPlaceholder: "Sélectionnez une discussion pour commencer à clavarder"
  },
  en: {
    inbox: "Client Conversations",
    noMessages: "No conversations",
    panelHeader: "Sales & Support Chat",
    from: "Client:",
    received: "Received on",
    replyPlaceholder: "Write a reply to finalize purchase...",
    selectPlaceholder: "Select a conversation to start chatting"
  }
};

export default function AdminMessages() {
  const { lang } = useAuth();
  const t = translations[lang] || translations.fr;

  const [messages, setMessages] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [replyText, setReplyText] = useState('');
  const chatEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/support');
      setMessages(res.data.messages);
    } catch (err) { 
      console.error(err); 
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll support list every 4 seconds to sync messages in real-time
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedEmail, messages]);

  const handleSelectConv = async (email) => {
    setSelectedEmail(email);
    // Mark all unread messages for this email as read
    const unreadMsgs = messages.filter(m => m.email === email && !m.is_read);
    for (const msg of unreadMsgs) {
      try {
        await api.put(`/support/${msg.id}/read`);
      } catch (err) { 
        console.error(err); 
      }
    }
    fetchMessages();
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedEmail) return;

    const tempText = replyText;
    setReplyText('');

    try {
      const res = await api.post('/support', {
        email: selectedEmail,
        message: tempText,
        sender: 'admin'
      });
      if (res.data.success) {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateString));
  };

  // Group latest messages per client email for the left sidebar inbox
  const conversations = [];
  const seenEmails = new Set();
  // messages are sorted by created_at DESC from API, so first match is the latest one
  for (const m of messages) {
    if (!seenEmails.has(m.email)) {
      seenEmails.add(m.email);
      conversations.push(m);
    }
  }

  // Filter messages for the active conversation, sorted chronologically
  const activeChatMessages = messages
    .filter(m => m.email === selectedEmail)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-[75vh] flex overflow-hidden animate-fadeIn">
      {/* Left Sidebar: Conversations list */}
      <div className="w-1/3 border-r border-gray-100 p-0 overflow-y-auto bg-gray-50/50">
        <div className="p-5 bg-white border-b border-gray-100 sticky top-0 z-10">
          <h3 className="font-extrabold text-lg text-brand-dark tracking-tighter">{t.inbox}</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {conversations.map(msg => {
            const hasUnread = messages.some(m => m.email === msg.email && !m.is_read && m.sender === 'client');
            const isSelected = selectedEmail === msg.email;
            return (
              <div 
                key={msg.id} 
                onClick={() => handleSelectConv(msg.email)}
                className={`p-5 cursor-pointer transition-all ${isSelected ? 'bg-blue-50 border-l-4 border-brand-accent' : 'hover:bg-white border-l-4 border-transparent'} ${hasUnread ? 'bg-white' : 'opacity-80'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className={`text-sm truncate ${hasUnread ? 'font-black text-brand-dark' : 'font-semibold text-gray-700'}`}>{msg.email}</p>
                  {hasUnread && <span className="w-2.5 h-2.5 rounded-full bg-brand-accent mt-1 shrink-0"></span>}
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">
                  <span className="font-bold">{msg.sender === 'admin' ? 'Vous: ' : ''}</span>
                  {msg.message}
                </p>
                <p className="text-[10px] text-gray-400 mt-2">{formatDate(msg.created_at)}</p>
              </div>
            );
          })}
          {conversations.length === 0 && <p className="p-10 text-center text-gray-400 text-sm font-medium">{t.noMessages}</p>}
        </div>
      </div>

      {/* Right Side: Conversation thread */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedEmail ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Thread Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10 shadow-sm">
              <div>
                <h2 className="text-md font-bold text-brand-dark">{t.panelHeader}</h2>
                <p className="text-gray-500 text-xs mt-1">{t.from} <span className="font-semibold text-brand-accent">{selectedEmail}</span></p>
              </div>
            </div>

            {/* Bubble Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {activeChatMessages.map((msg) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex items-start gap-3 ${isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isAdmin && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-brand-accent text-xs font-bold flex items-center justify-center shrink-0">
                        CL
                      </div>
                    )}
                    <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm border text-sm ${
                      isAdmin 
                        ? 'bg-brand-dark text-white border-brand-dark rounded-tr-none' 
                        : 'bg-white text-gray-800 border-gray-100 rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      <p className={`text-[9px] mt-2 text-right ${isAdmin ? 'text-gray-400' : 'text-gray-400'}`}>
                        {formatDate(msg.created_at)}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="w-8 h-8 rounded-full bg-brand-accent text-white text-[10px] font-black flex items-center justify-center shrink-0">
                        AD
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Bottom response input */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-gray-100 bg-white flex items-center gap-3">
              <input 
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t.replyPlaceholder}
                className="flex-1 px-5 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-gray-50 focus:bg-white transition-all"
              />
              <button 
                type="submit"
                className="bg-brand-dark text-white p-3.5 rounded-2xl hover:bg-gray-800 active:scale-95 transition flex items-center justify-center cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Inbox className="w-16 h-16 mb-4 text-gray-300" />
            <p className="font-medium">{t.selectPlaceholder}</p>
          </div>
        )}
      </div>
    </div>
  );
}
