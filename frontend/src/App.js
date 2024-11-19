import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from './store';
import axios from 'axios';
import './App.css';

function App() {
    const dispatch = useDispatch();
    const language = useSelector((state) => state.language.value);
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const handleLanguageChange = (e) => {
        dispatch(setLanguage(e.target.value));
    };

    const handleSendMessage = async () => {
        try {
            const res = await axios.post('https://your-replit-url/backend/process', {
                text: message,
                language: language,
            });
            setResponse(res.data);
        } catch (error) {
            console.error(error);
            setResponse('Error processing your request.');
        }
    };

    return (
        <div className="App">
            <h1>ExportGPT</h1>
            <select onChange={handleLanguageChange} value={language}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
            </select>
            <div>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    rows="4"
                    cols="50"
                ></textarea>
            </div>
            <button onClick={handleSendMessage}>Send</button>
            <div>
                <h2>Response:</h2>
                <p>{response}</p>
            </div>
        </div>
    );
}

export default App;
