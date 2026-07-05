import { useState, useEffect, useRef } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, User, MessageSquare, ArrowLeft, Shield } from 'lucide-react';

export default function MessagesPage() {
  const { user, lang } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/support/my-messages');
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMessages();
    
    // Auto-poll messages every 4 seconds to simulate live chat
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [user]);

  // Auto-send product purchase message if navigated with initialMsg
  useEffect(() => {
    if (location.state?.initialMsg && user) {
      const autoSend = async () => {
        try {
          await api.post('/support', {
            email: user.email,
            message: location.state.initialMsg,
            sender: 'client'
          });
          // Clear history state to avoid sending again on page refresh
          window.history.replaceState({}, document.title);
          fetchMessages();
        } catch (err) {
          console.error('Error auto-sending chat message:', err);
        }
      };
      autoSend();
    }
  }, [location.state, user]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const tempText = inputText;
    setInputText('');

    try {
      const res = await api.post('/support', {
        email: user.email,
        message: tempText,
        sender: 'client'
      });
      if (res.data.success) {
        fetchMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fadeIn">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-dark transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{lang === 'fr' ? 'Retour' : 'Back'}</span>
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-[65vh] flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-brand-accent p-2.5 rounded-2xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-brand-dark">{lang === 'fr' ? 'Support & Achat USD.Pro' : 'USD.Pro Support & Sales'}</h2>
              <p className="text-xs text-green-500 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>{lang === 'fr' ? 'Administrateur connecté' : 'Administrator Online'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Chat History Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {loading ? (
            <p className="text-center text-gray-400 text-sm py-10 animate-pulse">Chargement de la conversation...</p>
          ) : (
            <>
              {/* Default Welcome message if empty */}
              {messages.length === 0 && (
                <div className="text-center space-y-3 py-10">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-medium text-gray-500">
                    {lang === 'fr' 
                      ? 'Démarrez la discussion avec l\'administrateur pour passer commande ou poser une question.' 
                      : 'Start chatting with the administrator to place an order or ask a question.'}
                  </p>
                </div>
              )}

              {/* Messages bubbles */}
              {messages.map((msg) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex items-start gap-3 ${isAdmin ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAdmin && (
                      <div className="w-8 h-8 rounded-full bg-brand-dark text-white text-[10px] font-black flex items-center justify-center shrink-0">
                        AD
                      </div>
                    )}
                    <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm border text-sm ${
                      isAdmin 
                        ? 'bg-white text-gray-800 border-gray-100 rounded-tl-none' 
                        : 'bg-brand-accent text-white border-blue-600 rounded-tr-none'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      <p className={`text-[9px] mt-2 text-right ${isAdmin ? 'text-gray-400' : 'text-blue-200'}`}>
                        {formatDate(msg.created_at)}
                      </p>
                    </div>
                    {!isAdmin && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-brand-accent text-xs font-bold flex items-center justify-center shrink-0">
                        {user.first_name[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input form */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex items-center gap-3">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={lang === 'fr' ? 'Écrire un message...' : 'Write a message...'}
            className="flex-1 px-5 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-gray-50 focus:bg-white transition-all"
          />
          <button 
            type="submit"
            className="bg-brand-accent text-white p-3.5 rounded-2xl hover:bg-blue-600 active:scale-95 transition flex items-center justify-center cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
