import { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets.js';
import { Context } from '../../context/ContextProvider.jsx';

function Sidebar({ isExpanded, toggleSidebar }) {
    const { onSent, prevPrompts, setRecentPrompt, newChat, conversationHistory, setConversationHistory } = useContext(Context);

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        const history = conversationHistory.filter(entry => entry.user === prompt);
        setConversationHistory(history); // Load the conversation history for the selected prompt
        await onSent(prompt);
    }

    return (
        <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
            <div className="top">
                <img onClick={toggleSidebar} className="menu" src={assets.menu_icon} alt="Menu" />
                <div onClick={newChat} className="new-chat">
                    <img src={assets.plus_icon} alt="New Chat" />
                    {isExpanded ? <p>New Chat</p> : null}
                </div>
                {isExpanded &&
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        {prevPrompts.map((item, index) => (
                            <div key={index} onClick={() => loadPrompt(item)} className="recent-entry">
                                <img src={assets.message_icon} alt="Message" />
                                <p>{item.slice(0, 18)} ...</p>
                            </div>
                        ))}
                    </div>
                }
            </div>
            {/* <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="Help" />
                    {isExpanded ? <p>Help</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="Activity" />
                    {isExpanded ? <p>Activity</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="Settings" />
                    {isExpanded ? <p>Settings</p> : null}
                </div>
            </div> */}
        </div>
    )
}

export default Sidebar;
