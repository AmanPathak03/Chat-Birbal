import React, { useContext, useState, useEffect, useRef } from 'react'; // Add useRef and useEffect
import './Main.css';
import { assets } from '../../Assets/assets.js';
import { Context } from '../../context/ContextProvider.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
import handleVoiceInput from '../../config/handleVoiceInput.js';

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, conversationHistory } = useContext(Context);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isListening, setIsListening] = useState(false); 
    const chatHistoryRef = useRef(null); 

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleCardClick = (text) => {
        setInput(text);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() !== '') {  
                onSent(); 
            }
        }
    };

    const handleMicClick = async () => {
        try {
            setIsListening(!isListening); // Start animation
            if (!isListening) {
                console.log('Start Listening...');
            }else{
                console.log('Stop Listening...');
            }
            const voiceText = await handleVoiceInput(); 
            setInput(voiceText); 
        } catch (error) {
            console.error('Error with voice input:', error);
        } finally {
            setIsListening(false); 
        }
    };

    
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight; // Scroll to the bottom
        }
    }, [conversationHistory]); // Trigger when conversationHistory changes

    // Helper function to remove HTML tags
    const stripHtml = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    };
    
    return (
        <div className={main ${isExpanded ? 'expanded' : ''}}>
            <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
            <div className="menu" onClick={toggleSidebar}></div>
            <div className='nav'>
                <p>Birbal</p>
                <img src={assets.birbal_logo} alt="Birbal Logo" />
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
                                <img src={assets.compass_icon} alt="Compass Icon" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Show me current stock price of BSE.")}>
                                <p>Show me current stock price of BSE.</p>
                                <img src={assets.bulb_icon} alt="Bulb Icon" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Brainstorm ideas to develop a successful Business.")}>
                                <p>Brainstorm ideas to develop a successful Business.</p>
                                <img src={assets.message_icon} alt="Message Icon" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Improve the readability of the following text.")}>
                                <p>Improve the readability of the following text.</p>
                                <img src={assets.code_icon} alt="Code Icon" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='result'>
                        {/* <div className="result-title">
                            <img src={assets.birbal_response} alt="Birbal Response" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.birbal} alt="Birbal" />
                            {loading ? (
                                <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div> */}
                    </div>
                )}
                <div className="chat-history" ref={chatHistoryRef}>
                    {conversationHistory && conversationHistory.length > 0 ? (
                        conversationHistory.map((entry, index) => (
                        <div key={index} className={chat-message ${entry.role === 'user' ? 'user-message' : 'bot-message'}}>
                            {entry.role === 'user' ? (
                                <> 
                                    <img className="user-avatar" src={assets.birbal_response} alt="User Icon" />
                                    <div className="message-content">
                                        {entry.parts.map((part, i) => (
                                            <p key={i}>{stripHtml(part.text)}</p>
                                        ))}
                                    </div>
                                    
                                </>
                            ) : (
                                <>
                                    <img className="bot-avatar" src={assets.birbal} alt="Bot Icon" />
                                    <div className="message-content">
                                        {entry.parts.map((part, i) => (
                                            <p key={i}>{stripHtml(part.text)}</p>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p></p>
                )}
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
                        <img 
                            onClick={handleMicClick} 
                            src={assets.mic_icon} 
                            alt="Mic Icon" 
                            onKeyDown={handleKeyDown}
                            className={isListening ? 'active' : ''} 
                        />
                        {isListening && (
                        <div className="voice-animation-container">
                            <div className="voice-bar"></div>
                            <div className="voice-bar"></div>
                            <div className="voice-bar"></div>
                            <div className="voice-bar"></div>
                            <div className="voice-bar"></div>
                        </div>
                        )}
                        <div>
                            {input && (<img onClick={() => onSent()} src={assets.send_icon} alt="Send Icon" />)} 
                        </div>
                    </div>
                    <p className="bottom-info">
                        Birbal is dedicated to assist you with any questions you may have.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Main;
