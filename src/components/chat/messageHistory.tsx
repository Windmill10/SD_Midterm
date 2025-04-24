import React, { use, useRef } from 'react';
import { useState, useEffect } from 'react';
import { subscribeToMessages } from '../../services/roomService';
import { Message } from '../../common/interfaces';

interface MessageHistoryProps {
  roomId: string;
}
const MessageHistory: React.FC<MessageHistoryProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToMessages(
      roomId,
      (messages) => {
        setMessages(messages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    )

    return () => unsubscribe();
  }, [roomId]);
  return (
    <div className="message-history">
      {messages.length === 0 && <div>No messages yet</div>}
      {messages.length !== 0 && messages.map((message) => (
        <div key={message.id} className="message">
          <div className="message-sender">{message.senderId}</div>
          <div className="message-text">{message.text}</div>
          <div className="message-timestamp">{new Date(message.createdAt.seconds * 1000).toLocaleString()}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}



export default MessageHistory;