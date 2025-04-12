import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Send,
  Star,
  Inbox,
  Archive,
  Trash2,
  Mail,
  MailOpen,
} from 'lucide-react';

interface Message {
  id: string;
  sender: {
    name: string;
    email: string;
    avatar: string;
  };
  subject: string;
  preview: string;
  isRead: boolean;
  isStarred: boolean;
  timestamp: string;
  folder: 'inbox' | 'archive' | 'trash';
}

const mockMessages: Message[] = [
  {
    id: 'M001',
    sender: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe',
    },
    subject: 'Booking Inquiry - Paris Adventure',
    preview: 'Hi, I would like to know more about the Paris Adventure package...',
    isRead: false,
    isStarred: true,
    timestamp: '2024-04-12T10:30:00',
    folder: 'inbox',
  },
  {
    id: 'M002',
    sender: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
    },
    subject: 'Cancellation Request',
    preview: 'Due to unforeseen circumstances, I need to cancel my booking...',
    isRead: true,
    isStarred: false,
    timestamp: '2024-04-11T15:45:00',
    folder: 'inbox',
  },
  // Add more mock messages as needed
];

export const MessagesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');

  const folders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = message.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleMessageClick = (message: Message) => {
    if (!message.isRead) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === message.id ? { ...m, isRead: true } : m
        )
      );
    }
    setSelectedMessage(message);
  };

  const handleStarMessage = (messageId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, isStarred: !m.isStarred } : m
      )
    );
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    // TODO: Implement API call to send reply
    setReplyText('');
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex gap-6">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-card rounded-lg border p-4">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>

        {/* Folders */}
        <nav className="space-y-1">
          {folders.map((folder) => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedFolder === folder.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{folder.label}</span>
                {folder.id === 'inbox' && (
                  <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {messages.filter((m) => !m.isRead && m.folder === 'inbox').length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Messages List */}
      <div className="flex-1 bg-card rounded-lg border overflow-hidden">
        {selectedMessage ? (
          <div className="h-full flex flex-col">
            {/* Message Header */}
            <div className="p-4 border-b">
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                ← Back to messages
              </button>
              <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={selectedMessage.sender.avatar}
                  alt={selectedMessage.sender.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium">{selectedMessage.sender.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMessage.sender.email}
                  </p>
                </div>
                <span className="ml-auto text-sm text-muted-foreground">
                  {formatDate(selectedMessage.timestamp)}
                </span>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 p-4 overflow-auto">
              <p className="whitespace-pre-wrap">{selectedMessage.preview}</p>
            </div>

            {/* Reply Box */}
            <div className="p-4 border-t">
              <div className="flex gap-4">
                <textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 p-3 rounded-lg border bg-background resize-none"
                  rows={3}
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="self-end px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handleMessageClick(message)}
                className={`flex items-start gap-4 p-4 border-b last:border-none cursor-pointer hover:bg-accent/50 transition-colors ${
                  !message.isRead ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  <img
                    src={message.sender.avatar}
                    alt={message.sender.name}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.sender.name}</span>
                    <button
                      onClick={(e) => handleStarMessage(message.id, e)}
                      className={`p-1 rounded-full hover:bg-accent transition-colors ${
                        message.isStarred ? 'text-yellow-500' : 'text-muted-foreground'
                      }`}
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="font-medium text-sm truncate">{message.subject}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {message.preview}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(message.timestamp)}
                  </span>
                  {!message.isRead ? (
                    <Mail className="h-4 w-4 text-primary" />
                  ) : (
                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 