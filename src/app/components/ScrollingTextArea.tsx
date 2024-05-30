"use client";
import { useEffect, useState } from "react";

export default function ScrollingTextArea() {
    const initialMessages = [
        "Good Morning! 🌞",
        "Have a great day! 🌟",
        "Stay positive and happy! 😊",
        "Success is not final, failure is not fatal. 💪",
        "Keep pushing forward! 🚀"
    ];
    
    const [messages, setMessages] = useState<string[]>(initialMessages);
    const [newMessage, setNewMessage] = useState<string>("");

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (messages.length > 0) {
                setMessages((prevMessages) => [...prevMessages.slice(1), prevMessages[0]]);
            }
        }, 3000); // Change message every 3 seconds

        return () => clearInterval(intervalId);
    }, [messages]);

    const handleAddMessage = () => {
        if (newMessage.trim() !== "") {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setNewMessage("");
        }
    };

    const handleResetMessages = () => {
        setMessages([]);
    };

    return (
        <div className="scrolling-text-area">
            <div className="scrolling-text-container">
                <div className="scrolling-text">
                    {messages.map((message, index) => (
                        <span key={index}>{message}</span>
                    ))}
                </div>
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter your message"
                />
                <button onClick={handleAddMessage}>Add Message</button>
                <button onClick={handleResetMessages}>Reset Messages</button>
            </div>
        </div>
    );
}
