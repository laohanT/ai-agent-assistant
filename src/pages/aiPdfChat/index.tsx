import React, { useState, useRef, useEffect } from 'react';
import './AIPdfChat.css';
import { BASE_URL, getOrCreateSessionIds } from '../../utils/tools';
import { LinkOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const AIPdfChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [uploadLoading, setUploadLoading] = useState<boolean>(false)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
    };

    const getAiMessage = async (message: string) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 30000);

        try {
            const response = await fetch(`${BASE_URL}/rag/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: message, }),
                signal: controller.signal,
            });

            clearTimeout(timer);
            const res = await response.json()
            const currentMsgId = Date.now().toString();
            addMessage({ id: currentMsgId, role: 'assistant', content: res.answer });


        } catch (error) {
            console.error('AI message error:', error);
        } finally {
            clearTimeout(timer);
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;
        const messageText = inputValue.trim();
        setInputValue('');
        setIsLoading(true);
        addMessage({ id: Date.now().toString(), role: 'user', content: messageText });
        await getAiMessage(messageText);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileSelect = async (info: any) => {
        // setSelectedFile(file);
        try {
            setUploadLoading(true)
            const formData = new FormData()
            formData.append('file', info.file)
            const response = await fetch(`${BASE_URL}/rag/upload`, {
                method: "POST",
                body: formData
            })
            const res = await response.json()
            if (res.status === 200) {
                messageApi.success('上传成功')
            } else {
                messageApi.error('上传失败！')
            }

        } catch (error) {
            console.log(error, 'error');

        } finally {
            setUploadLoading(false)
        }
    };



    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const sessionIds = getOrCreateSessionIds();
        setCurrentSessionId(sessionIds[sessionIds.length - 1]);
    }, []);

    return (
        <div className="ai-pdf-chat-container">
            <div className="ai-pdf-chat-main">
                <div className="main-header">
                    <h3>AI 助手</h3>
                    <p className="ai-description">RAG检索增强，根据上传PDf文件来回答问题，只回答文档本身内容。</p>
                </div>
                <div className="chat-messages">
                    {messages.length > 0 ? (
                        messages.map(message => (
                            <div key={message.id} className={`message ${message.role === 'user' ? 'user' : 'ai'}`}>
                                <div className="message-content">{message.content || '...'} </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-session">请输入你的问题，AI 助手会在这里回复你。</div>
                    )}
                    {isLoading && <div className="loading">AI 正在思考...</div>}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-area">
                    <div className="input-row">
                        <textarea
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="输入您的问题..."
                            rows={3}
                        />
                        <Upload
                            accept=".pdf"
                            beforeUpload={() => false}
                            onChange={handleFileSelect}
                            showUploadList={false}
                        >
                            <Button className="upload-icon-btn" loading={uploadLoading}>
                                <LinkOutlined />
                            </Button>
                        </Upload>
                        <button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
                            发送
                        </button>
                    </div>
                </div>
            </div>
            {contextHolder}
        </div>
    );
};

export default AIPdfChat;
