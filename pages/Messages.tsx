import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConversations, useConversation, useSendMessage } from '../src/api/hooks/materials';
import { useMe } from '../src/api/auth';
import { Search, Send, MoreVertical, Phone, Video, ArrowRight, MessageCircle, Plus, X, Edit, Ban, Loader2 } from 'lucide-react';
import { formatJalali } from '../src/utils/date';

const MessagesPage = () => {
  const navigate = useNavigate();
  const { id: conversationId } = useParams<{ id: string }>();
  const { data: currentUser } = useMe();

  const { data: conversations = [], isLoading: convLoading, refetch: refetchConversations } = useConversations();
  const { data: activeConversation, isLoading: msgLoading } = useConversation(conversationId || '');
  const sendMessageMutation = useSendMessage();

  const [activeChat, setActiveChat] = useState<string | null>(conversationId || null);
  const [messageInput, setMessageInput] = useState('');
  const [isNewChatMode, setIsNewChatMode] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [messages, setMessages] = useState(activeConversation?.messages || []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);

  // Sync activeChat with URL param on mount
  useEffect(() => {
    if (conversationId) {
      setActiveChat(conversationId);
    }
  }, [conversationId]);

  // Update messages when activeConversation changes
  useEffect(() => {
    if (activeConversation?.messages) {
      setMessages(activeConversation.messages);
    }
  }, [activeConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isBlocked = activeConversation && blockedUsers.includes(activeConversation.participant.id);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    setSending(true);
    try {
      await sendMessageMutation.mutateAsync({
        conversationId: activeChat,
        content: messageInput,
      });
      setMessageInput('');
      // Refetch to get updated conversation with new message
      // The mutation could also return the new message
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  // Combine conversations for "Contacts" list (excluding current user)
  const allContacts = Array.from(new Map(
    conversations
      .map(c => c.participant)
      .filter(u => u.id !== currentUser?.id)
      .map(u => [u.id, u])
  ).values());

  const filteredContacts = allContacts.filter(u =>
    u.name.toLowerCase().includes(newChatSearch.toLowerCase())
  );

  const startNewChat = (user: typeof currentUser) => {
    const existingChat = conversations.find(c => c.participant.id === user.id);
    if (existingChat) {
      setActiveChat(existingChat.id);
    } else {
      // TODO: Create new conversation API endpoint
      // For now, just navigate to the conversation if it exists
    }
    setIsNewChatMode(false);
    setNewChatSearch('');
  };

  const toggleBlockUser = () => {
    if (!activeConversation) return;
    const userId = activeConversation.participant.id;
    if (blockedUsers.includes(userId)) {
      setBlockedUsers(prev => prev.filter(id => id !== userId));
    } else {
      setBlockedUsers(prev => [...prev, userId]);
    }
    setShowMenu(false);
  };

  const conversationList = isNewChatMode ? filteredContacts : conversations;

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200 overflow-hidden flex shadow-sm">
      {/* Sidebar / Conversation List */}
      <div className={`w-full md:w-80 border-l border-slate-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="font-bold text-lg text-slate-800">
              {isNewChatMode ? 'گفتگوی جدید' : 'پیام‌ها'}
            </h2>
            <button
              onClick={() => setIsNewChatMode(!isNewChatMode)}
              className={`p-2 rounded-full transition-colors ${isNewChatMode ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500' : 'text-blue-600 hover:bg-blue-50'}`}
              title={isNewChatMode ? 'انصراف' : 'پیام جدید'}
            >
              {isNewChatMode ? <X size={20} /> : <Edit size={20} />}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={isNewChatMode ? newChatSearch : ''}
              onChange={(e) => isNewChatMode && setNewChatSearch(e.target.value)}
              placeholder={isNewChatMode ? 'جستجوی کاربر...' : 'جستجو در پیام‌ها...'}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-100"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isNewChatMode ? (
            /* Contacts List */
            <div className="p-2">
              <p className="px-4 py-2 text-xs font-bold text-slate-400">مخاطبین پیشنهادی</p>
              {filteredContacts.map(user => (
                <div
                  key={user.id}
                  onClick={() => startNewChat(user)}
                  className="p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors rounded-xl"
                >
                  <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{user.name}</h4>
                    <p className="text-xs text-slate-500">{user.role === 'INSTRUCTOR' ? 'استاد' : 'دانشجو'}</p>
                  </div>
                  <Plus size={16} className="text-blue-600" />
                </div>
              ))}
              {filteredContacts.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
                  <p>مخاطبی یافت نشد</p>
                </div>
              )}
            </div>
          ) : (
            /* Conversations List */
            convLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse p-4 flex gap-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-slate-200 rounded w-1/3" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length > 0 ? (
              conversations.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`p-4 flex gap-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 ${activeChat === chat.id ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                >
                  <img src={chat.participant.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-900 truncate">{chat.participant.name}</h4>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {formatJalali(chat.lastMessage.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-500 truncate">{chat.lastMessage.content}</p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
                <p>هیچ گفتگویی وجود ندارد</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex-col bg-slate-50 ${activeChat ? 'flex' : 'hidden md:flex'}`}>
        {activeChat && activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 flex-shrink-0 z-10 relative">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveChat(null)} className="md:hidden text-slate-500">
                  <ArrowRight />
                </button>
                <img src={activeConversation.participant.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-bold text-slate-900">{activeConversation.participant.name}</h3>
                  <span className="text-xs text-green-500 font-medium">آنلاین</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400 relative">
                <button className="p-2 hover:bg-slate-100 rounded-full"><Phone size={20} /></button>
                <button className="p-2 hover:bg-slate-100 rounded-full"><Video size={20} /></button>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-slate-100 rounded-full"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {showMenu && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20">
                      <button
                        onClick={toggleBlockUser}
                        className={`w-full text-right px-4 py-3 text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors ${isBlocked ? 'text-slate-700' : 'text-red-600'}`}
                      >
                        <Ban size={16} />
                        {isBlocked ? 'رفع مسدودیت' : 'مسدود کردن'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => {
                const isMe = msg.sender.id === currentUser?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <span className={`text-[10px] block mt-1 text-left ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>{formatJalali(msg.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
              {isBlocked && (
                <div className="text-center text-xs text-slate-400 my-2">
                  پیام‌های جدید از این کاربر نمایش داده نمی‌شوند.
                </div>
              )}
            </div>

            {/* Input Area */}
            {isBlocked ? (
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex-shrink-0 flex flex-col items-center justify-center text-center gap-2">
                <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                  <Ban size={18} />
                  <span>این کاربر مسدود شده است.</span>
                </div>
                <p className="text-xs text-slate-500">برای ارسال پیام، ابتدا باید کاربر را از حالت مسدود خارج کنید.</p>
                <button
                  onClick={toggleBlockUser}
                  className="text-blue-600 text-sm font-bold hover:underline mt-1"
                >
                  رفع مسدودیت
                </button>
              </div>
            ) : (
              <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="پیام خود را بنویسید..."
                    className="flex-1 px-4 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim() || sending}
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={20} className="rotate-180" />
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={40} />
            </div>
            <p className="text-lg font-medium">یک گفتگو را انتخاب کنید یا پیام جدیدی ارسال کنید</p>
            <button
              onClick={() => setIsNewChatMode(true)}
              className="mt-4 px-6 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
            >
              ارسال پیام جدید
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;