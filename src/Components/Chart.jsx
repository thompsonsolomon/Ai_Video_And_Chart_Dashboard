import { useState, useEffect, useRef } from "react";
import { currentUser } from "./data";
const isToday = (someDate) => {
    const today = new Date();
    return (
        someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
    );
};
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

const Chat = () => {
    const [chat, setChat] = useState([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef(null);

    useEffect(() => {
        const savedChat = JSON.parse(localStorage.getItem("chatHistory")) || [];
        setChat(savedChat);
    }, []);

    useEffect(() => {
        if (chat.length > 0) {
            localStorage.setItem("chatHistory", JSON.stringify(chat));
        }
    }, [chat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const now = new Date();
        const userMsg = {
            id: Date.now(),
            role: "user",
            text: input.trim(),
            date: now.toDateString(),
            time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            timestamp: now,
        };

        const updatedChat = [...chat, userMsg];
        setChat(updatedChat);
        setInput("");

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "X-Title": "My Chat App",
                },
                body: JSON.stringify({
                    model: "mistralai/mistral-7b-instruct",
                    messages: [
                        {
                            role: "system",
                            content: `You are chatting with Solomon's assistant.`,
                        },
                        ...updatedChat.map((msg) => ({
                            role: msg.role === "user" ? "user" : "assistant",
                            content: msg.text,
                        })),
                    ],
                }),
            });

            const data = await response.json();
            const aiResponse = data.choices?.[0]?.message?.content || "Hmm... something went wrong.";

            const aiMsg = {
                id: Date.now() + 1,
                role: "ai",
                text: aiResponse,
                date: now.toDateString(),
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                timestamp: new Date(),
            };

            setChat((prev) => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    const renderMessagesGroupedByDate = () => {
        const groups = {};
        chat.forEach((msg) => {
            groups[msg.date] = groups[msg.date] || [];
            groups[msg.date].push(msg);
        });

        return Object.entries(groups).map(([date, messages], i) => {
            const day = new Date(date);
            const isDateToday = isToday(day);
            return (
                <div key={i}>
                    <div className="text-center mt-6 text-gray-400 text-sm">
                        {isDateToday ? "Today" : date}
                    </div>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                } px-2 mt-2`}
                        >
                            <div
                                className={`max-w-[70%] p-3 rounded-xl text-sm ${msg.role === "user"
                                        ? "bg-blue-100 text-black"
                                        : "bg-white border text-gray-700"
                                    }`}
                            >
                                <p>{msg.text}</p>
                                <div className="text-xs text-gray-400 text-right mt-1">{msg.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        });
    };

    return (
        <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
            {/* Header */}
            {
                currentUser.map((data, index) => {
                    return(
                        <div key={index} className="bg-white shadow p-4 flex items-center gap-4">
                        <img
                            src={data.profile}
                            alt="User"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-lg text-gray-500 font-semibold">{data.name}</h2>
                            <p className="text-sm text-gray-500">{data.gender} • {data.age} y.o.</p>
                        </div>
                    </div>
        
                    )
                })
            }
           
            {/* Tabs */}
            <div className="flex justify-around border-b text-sm text-gray-500">
                <button className="py-2 px-4">Record</button>
                <button className="py-2 px-4 border-b-2 border-[#e08777] text-[#e08777]">Chat</button>
                <button className="py-2 px-4">Notes</button>
                <button className="py-2 px-4">Docs</button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto px-2 scrollbar-hide">{renderMessagesGroupedByDate()}</div>

            <div ref={scrollRef} />

            {/* Input Area */}
            <div className="p-2 bg-white border-t flex items-center gap-1">
                <button className="text-gray-500 border rounded-[5px] p-1 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                    </svg>

                </button>
                <input
                    type="text"
                    placeholder="Write your message"
                    className="flex-1 border  rounded-[5px] bg-white text-[#666] px-4 py-2 text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={sendMessage} className="text-green-600 text-xl">➤</button>
            </div>
        </div>
    );
};

export default Chat;
