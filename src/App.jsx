import React, { useEffect, useState } from 'react';
import MessageForm from './components/MessageForm';
import MessageList from './components/MessageList';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [editingMessage, setEditingMessage] = useState(null);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`https://bluesky-chat-app-trial-0122e7859a66.herokuapp.com/messages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'LaHbp3GGJx'
                },
            });
            const data = await response.json();
            setMessages(data.reverse());
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages(); // 初回データ取得
    }, []);

    const handleSendMessage = async (msg) => {
        try {
            if (editingMessage) {
                await fetch(`https://bluesky-chat-app-trial-0122e7859a66.herokuapp.com/messages/${msg.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'LaHbp3GGJx'
                    },
                    body: JSON.stringify(msg),
                });
                setEditingMessage(null);
            } else {
                await fetch(`https://bluesky-chat-app-trial-0122e7859a66.herokuapp.com/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'LaHbp3GGJx'
                    },
                    body: JSON.stringify(msg),
                });
            }
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleEditMessage = (msg) => {
        setEditingMessage(msg);
    };

    const handleDeleteMessage = async (id) => {
        try {
            console.log('Deleting message with ID:', id);
            await fetch(`https://bluesky-chat-app-trial-0122e7859a66.herokuapp.com/messages/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': 'LaHbp3GGJx'
                },
            });
            fetchMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <div>
            <h1 className="text-center mt-4">Chat App</h1>
            <MessageList messages={messages} onEdit={handleEditMessage} onDelete={handleDeleteMessage} />
            <MessageForm onSend={handleSendMessage} editingMessage={editingMessage} setEditingMessage={setEditingMessage} />
        </div>
    );
};

export default App;