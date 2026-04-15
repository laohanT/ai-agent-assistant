import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import './AIChat.css'; // 假设我们会创建这个CSS文件
import { getOrCreateSessionIds } from '../../utils/tools';
import { Tooltip } from 'antd';
import rehypeHighlight from 'rehype-highlight';

interface Message {
    id: string;
    role: "user" | "assistant",
    content: string;
}

interface Session {
    sessionId: string;
    messages: Message[];
}

interface DataType {
    id: string,
    role: "user" | "assistant",
    content: string
}
interface DataSession {
    sessionId: string,
    data: DataType[]
}



interface ResponseData {
    data: DataSession[],
    sessionId?: string
}




const AIChat: React.FC = () => {
    // 会话
    const [sessions, setSessions] = useState<Session[]>([]);
    // 当前的会话ID
    const [currentSessionId, setCurrentSessionId] = useState<string>('');
    // 输入框内容
    const [inputValue, setInputValue] = useState<string>('');
    // 是否在发送中
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // 当前会话
    const currentSession = sessions.find(s => s.sessionId === currentSessionId);



    // 滚动条
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    // 创建新会话
    const createNewSession = (): string => {
        const sessionids = getOrCreateSessionIds()
        const sessionId = sessionids[sessionids.length - 1]
        const newSession: Session = {
            sessionId: sessionId,
            messages: []
        };
        setSessions(prev => [...prev, newSession]);
        return newSession.sessionId;
    };

    // 处理AI返回的数据
    const handleSessionMessage = (messages: Message[], message: Message): Message[] => {
        const index = messages.findIndex(item => item.id === message.id)
        if (index >= 0) {
            // 找到
            const msgArr = [...messages]
            msgArr[index] = { ...msgArr[index], content: message.content }
            return msgArr
        } else {
            return [...messages, message]
        }
    }
    // 往会话中添加消息
    const addMessageToSession = (sessionId: string, message: Message) => {
        setSessions(prev => {
            const index = prev.findIndex(item => item.sessionId === sessionId)
            let sessionArr = [...prev]
            if (index >= 0) {
                sessionArr[index] = { ...sessionArr[index], messages: handleSessionMessage(sessionArr[index].messages, message) }
                return sessionArr
            } else {
                sessionArr.push({ sessionId, messages: [message] })
                return sessionArr
            }
        }
        );
    };

    // 获取历史消息
    const getAllHistory = async () => {
        try {
            let response = await fetch(`${import.meta.env.VITE_AI_AGENT_URL}/chatMessage/getAllHistory`, {
                headers: {
                    "Content-Type": "application/json"
                },
            })
            let res: ResponseData = await response.json()
            const data = res.data.map(item => ({
                sessionId: item.sessionId,
                messages: item.data
            }))
            setSessions(data)

        } catch (error) {

        }
    }

    // 获取流式AI消息
    const getAiMessage = async (message: string) => {
        const controller = new AbortController()
        // 设置超时定时器
        let timer = setTimeout(() => {
            controller.abort()
        }, 30000)
        try {
            let response = await fetch('http://localhost:3001/chatMessage/agentToolStream', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message, sessionId: currentSessionId })
            })
            // 请求成功后清楚定时器
            clearTimeout(timer)
            // 请求失败
            if (!response.ok) {
                throw new Error(`HTTP error! status${response.status}`)
            }
            const reader = response.body?.getReader()
            if (!reader) {
                throw new Error('无法获取响应流的读取器')
            }
            const decoder = new TextDecoder()
            let fullAnswer: string = ''
            let currentMsgId = Date.now().toString()
            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    break
                }
                const chunk = decoder.decode(value)
                const lines = chunk.split('\n')
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6)
                        if (data === "[DONE]") continue
                        const content = JSON.parse(data)?.content
                        if (content) {
                            fullAnswer += content
                            addMessageToSession(currentSessionId, { id: currentMsgId, content: fullAnswer, role: "assistant" })
                        }
                    }
                }
            }


        } catch (error) {

        }
    }

    // 发送消息
    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;
        // 输入的消息
        const messageText = inputValue.trim();
        setInputValue('');
        setIsLoading(true);
        // console.log(currentSessionId, '发送时的id');
        addMessageToSession(currentSessionId, { "id": Date.now().toString(), "content": messageText, "role": 'user' })
        await getAiMessage(messageText)
        setIsLoading(false);

    };
    // Enter事件
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    // 切换会话历史
    const selectSession = (sessionId: string) => {
        setCurrentSessionId(sessionId);
    };
    // 新会话
    const handleNewSession = () => {
        const newSessionId = createNewSession();
        setCurrentSessionId(newSessionId);


    };

    useEffect(() => {
        scrollToBottom();
    }, [currentSession?.messages]);

    useEffect(() => {
        const sessionids = getOrCreateSessionIds()
        const sessionId = sessionids[sessionids.length - 1]
        setCurrentSessionId(sessionId)
        getAllHistory()
    }, [])

    return (
        <div className="ai-chat-container">
            <div className="ai-chat-sidebar">
                <div className="sidebar-header">
                    <div className="header-content">
                        <h3>会话列表</h3>
                        <button className="new-session-btn" onClick={handleNewSession}>新会话</button>
                    </div>
                </div>
                <div className="session-list">
                    {sessions.map(session => (
                        <Tooltip key={session.sessionId} title={session.messages[0]?.content.length > 18 ? session.messages[0]?.content : ''}>
                            <div
                                className={`session-item ${session.sessionId === currentSessionId ? 'active' : ''}`}
                                onClick={() => selectSession(session.sessionId)}
                            >
                                {session.messages.length > 0 ? session.messages[0]?.content : '新会话'}
                            </div>
                        </Tooltip>

                    ))}
                </div>
            </div>
            <div className="ai-chat-main">
                <div className="main-header">
                    <h3>AI助手</h3>
                </div>
                <div className="chat-messages">
                    {currentSession?.messages ? (
                        currentSession.messages.map(message => (
                            <div key={message.id} className={`message ${message.role === "user" ? 'user' : 'ai'}`}>
                                {message.role === "user"
                                    ?
                                    <div className="message-content">{message.content}</div>
                                    :
                                    <div className="message-content">
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{message.content}</ReactMarkdown>
                                    </div>

                                }


                            </div>
                        ))
                    ) : (
                        <div className="no-session">请选择历史会话或输入您要询问的问题</div>
                    )}
                    {isLoading && <div className="loading">AI正在思考...</div>}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-area">
                    <div className='input-row'>
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="输入您的问题..."
                            rows={3}
                        />
                        <button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
                            发送
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AIChat;