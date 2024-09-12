// Main.jsx
import React, { useContext, useState } from 'react';
import './Main.css';
import { assets } from '../../assets /assets.js';
import { Context } from '../../context/ContextProvider.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, conversationHistory } = useContext(Context);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    // Function to handle card click
    const handleCardClick = (text) => {
        setInput(text);
    };

    // Function to handle keydown events
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            onSent(); 
        }
    };

    return (
        <div className={`main ${isExpanded ? 'expanded' : ''}`}>
            <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
            <div className="menu" onClick={toggleSidebar}>
            </div>
            <div className='nav'>
                <p>Birbal</p>
                <img src={assets.birbal_logo} alt="" />
            </div>
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello Sir,</span></p>
                            <p><span>How can I help you today..?</span></p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => handleCardClick("Provide a list of questions to help me prepare for a software company manager job interview.")}>
                                <p>Provide a list of questions to help me prepare for a software company manager job interview.</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Show me current stock price of BSE.")}>
                                <p>Show me current stock price of BSE.</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Brainstorm ideas to develop a successful Business.")}>
                                <p>Brainstorm ideas to develop a successful Business.</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Improve the readability of the following text.")}>
                                <p>Improve the readability of the following text.</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='result'>
                        <div className="result-title">
                            <img src={assets.birbal_response} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.birbal} alt="" />
                            {loading ? (
                                <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                    </div>
                )}

                <div className="chat-history">
                    {conversationHistory.map((entry, index) => (
                        <div key={index} className="chat-message">
                            <div className="user-message">
                                <p>{entry.user}</p>
                            </div>
                            <div className="bot-message">
                                <p>{entry.bot}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="main-bottom">
                    <div className="search-box">
                        <textarea
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            placeholder='Ask your Birbal...'
                            onKeyDown={handleKeyDown} 
                            rows="1" 
                        />
                        <div>
                            {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        Birbal is dedicated to assist you with any questions you may have.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Main;