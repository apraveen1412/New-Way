import './Sidebar.css';
import { useEffect, useState } from "react";
import LogOutBtn from './LogOutBtn'
import axios from 'axios';

export default function Sidebar({flashMsg, conversations, setConversationId, setGetMessages}) {
    const [open, setOpen] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);
    console.log('sidebar: ',conversations);
    // #6c757d
    const handleChat = async (e)=>{
        const conversationId = e.currentTarget.id;
        setConversationId(conversationId);
        setSelectedConversation(conversationId);
        const getConvMsgs = await axios.get(`/api/conversation/${conversationId}`);
        setGetMessages(getConvMsgs.data);
    }

    const handleNewChat = (e)=>{
        setConversationId('');
        setGetMessages([]);
        setSelectedConversation(null);
    }
    return (
        <>
            {/* Sidebar */}
            <aside className={`sidebar bg-dark text-white ${open ? "sidebar-open" : "sidebar-closed"}`}>
                <div className="d-flex h-100 flex-column justify-content-between">
                    <div className="d-flex flex-column justify-content-start">
                    
                        {/* Sidebar Header */}
                        <div className="d-flex align-items-center justify-content-between p-3">
                            {open && ( <h5 className="mb-0">New Way</h5>)}
                            <button className="btn btn-dark" onClick={() => setOpen(!open)}>
                                <i className="fa-solid fa-bars"></i>
                            </button>
                        </div>

                        {/* Sidebar Content */}
                        {open && (
                            <div className="px-3 ">
                                <button className="btn btn-outline-light w-100 mb-2" onClick={handleNewChat}>
                                    <i className="fa-solid fa-plus me-2"></i>New Chat</button>
                                <p className='m-0 mt-2'>Chats</p>
                                <ul className="conversationHistory p-0">
                                    {conversations?.toReversed().map((conv) => (
                                        <li key={conv._id} >
                                            <button
                                                className={`conversation-btn btn m-0 mt-1 mb-1 w-100 ${selectedConversation === conv._id ? 'conversation-active' : '' }`} id={conv._id} onClick={handleChat}>
                                                {conv.conversationName}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                
                                
                            </div>
                        )}
                    </div>
                    <LogOutBtn flashMsg={flashMsg}/>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`main-content ${ open ? "content-sidebar-open" : "content-sidebar-closed"}`}>
                {/* chat UI goes here */}
            </main>
        </>
    );
}
