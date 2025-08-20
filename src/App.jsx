// import React, { useState, useRef, useEffect } from "react";

// // ChatGPT-like UI (single file) built with Vite + React + TailwindCSS
// // Usage: place this file as `src/App.jsx` in a Vite React project with Tailwind configured.

// export default function ChatUI() {
//   const [conversations, setConversations] = useState(() => {
//     try {
//       const raw = localStorage.getItem("chats_v1");
//       const parsed = raw ? JSON.parse(raw) : null;
//       if (parsed && parsed.length > 0) {
//         return parsed;
//       }
//     } catch (e) {
//       console.error("localStorage parse error", e);
//     }
//     return [
//       {
//         id: Date.now(),
//         title: "New chat",
//         messages: [
//           { id: 1, role: "assistant", text: "👋 Hi! What are you working on?" }
//         ]
//       }
//     ];
//   });

//   // const [activeConvId, setActiveConvId] = useState(() => {
//   //   const raw = localStorage.getItem("chats_v1");
//   //   const parsed = raw ? JSON.parse(raw) : null;
//   //   return parsed && parsed.length > 0 ? parsed[0].id : Date.now();
//   // });


//   const [activeConvId, setActiveConvId] = useState(conversations[0]?.id ?? null);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [dark, setDark] = useState(() => localStorage.getItem("chat_dark") === "1");
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     localStorage.setItem("chats_v1", JSON.stringify(conversations));
//   }, [conversations]);

//   useEffect(() => {
//     localStorage.setItem("chat_dark", dark ? "1" : "0");
//     if (dark) document.documentElement.classList.add("dark"); else document.documentElement.classList.remove("dark");
//   }, [dark]);

//   useEffect(() => scrollToBottom(), [activeConvId, isTyping]);

//   useEffect(() => {
//     function handler(e) {
//       // CTRL/CMD+K focuses input
//       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
//         e.preventDefault();
//         inputRef.current?.focus();
//       }
//       // CTRL/CMD+N new chat
//       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
//         e.preventDefault();
//         createConversation();
//       }
//     }
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [conversations]);

//   function scrollToBottom() {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }

//   function getActiveConversation() {
//     return conversations.find((c) => c.id === activeConvId);
//   }

//   function createConversation() {
//     const id = Date.now();
//     const conv = { id, title: `Chat ${conversations.length + 1}`, messages: [] };
//     setConversations((prev) => [conv, ...prev]);
//     setActiveConvId(id);
//   }

//   function deleteConversation(id) {
//     const newList = conversations.filter((c) => c.id !== id);
//     setConversations(newList);
//     if (activeConvId === id) setActiveConvId(newList[0]?.id ?? null);
//   }

//   function renameConversation(id, title) {
//     setConversations((prev) => prev.map(c => c.id === id ? {...c, title} : c));
//   }

//   function sendMessage() {
//     const text = input.trim();
//     if (!text) return;
//     const conv = getActiveConversation();
//     if (!conv) return;

//     const userMsg = { id: Date.now(), role: "user", text };
//     setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, messages: [...c.messages, userMsg] } : c));
//     setInput("");

//     // Fake assistant response (simulate network latency & typing)
//     setIsTyping(true);
//     setTimeout(() => {
//       const assistantMsg = { id: Date.now()+1, role: "assistant", text: generateAssistantReply(text) };
//       setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, messages: [...c.messages, assistantMsg] } : c));
//       setIsTyping(false);
//     }, 900 + Math.random() * 800);
//   }

//   async function generateAssistantReply(userText) {
//     try{
//       console.log('@@@@@@@@@@',userText)
//       const response = await fetch(`http://localhost:8000/chat?question=${encodeURIComponent(userText)}`);
//       console.log('#########',response);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let result = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         result += decoder.decode(value, { stream: true });
//         console.log('*********',result);
//         // You could even update UI here for live streaming
//       }

//       return result;
//     } catch (error) {
//       console.error("Error in generateAssistantReply:", error);
//       return "⚠️ Sorry, something went wrong while fetching the response from LLM API.";
//     }
//   }

//   function onInputKeyDown(e) {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   }

//   // rendering helpers
//   const active = getActiveConversation();

//   return (
//     <div className="h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//       {/* Sidebar */}
//       <aside className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
//         <div className="px-4 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">AI</div>
//             <div className="text-sm font-semibold">HankSaw </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button onClick={() => setDark(d => !d)} title="Toggle dark" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
//               {dark ? (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364 6.364l.707.707M6.343 6.343l-.707-.707m12.728 0l.707-.707M6.343 17.657l-.707.707"/></svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
//               )}
//             </button>
//             <button onClick={createConversation} title="New chat" className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">New</button>
//           </div>
//         </div>

//         <div className="p-3 flex-1 overflow-y-auto">
//           <div className="space-y-2">
//             {conversations.map((c) => (
//               <div key={c.id} className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${c.id === activeConvId ? 'bg-gray-100 dark:bg-gray-700' : ''}`} onClick={() => setActiveConvId(c.id)}>
//                 <div className="w-9 h-9 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold">{c.title.charAt(0)}</div>
//                 <div className="flex-1 min-w-0">
//                   <div className="text-sm font-medium truncate">{c.title}</div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.messages[c.messages.length-1]?.text ?? 'No messages yet'}</div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button onClick={(e) => { e.stopPropagation(); const newTitle = prompt('Rename conversation', c.title); if (newTitle) renameConversation(c.id, newTitle); }} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11l4-1 1 1 11-11a2.828 2.828 0 00-4-4L11 5z"/></svg>
//                   </button>
//                   <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete conversation?')) deleteConversation(c.id); }} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
//           <div>Shortcuts: <span className="text-gray-700 dark:text-gray-200">Ctrl/Cmd+K</span> focus • <span className="text-gray-700 dark:text-gray-200">Ctrl/Cmd+N</span> new</div>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 flex flex-col">
//         <div className="flex-1 overflow-hidden flex flex-col">
//           {/* Top bar */}
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <h2 className="text-lg font-semibold">{active?.title ?? 'No conversation selected'}</h2>
//               <div className="text-sm text-gray-500 dark:text-gray-400">Simulated — replace assistant responses with your LLM API</div>
//             </div>
//             <div className="flex items-center gap-3">
//               <button className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Export</button>
//               <button className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Settings</button>
//             </div>
//           </div>

//           {/* Messages area */}
//           <div className="flex-1 p-6 overflow-y-auto">
//             <div className="max-w-3xl mx-auto space-y-4">
//               {active?.messages.map((m) => (
//                 <MessageBubble key={m.id} role={m.role} text={m.text} />
//               ))}

//               {isTyping && (
//                 <div className="flex items-start gap-3">
//                   <div className="w-9 h-9 rounded-md bg-gray-200 dark:bg-gray-700" />
//                   <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-prose">
//                     <TypingIndicator />
//                   </div>
//                 </div>
//               )}

//               <div ref={messagesEndRef} />
//             </div>
//           </div>

//           {/* Composer */}
//           <div className="border-t border-gray-200 dark:border-gray-800 p-4">
//             <div className="max-w-3xl mx-auto">
//               <div className="flex items-start gap-3">
//                 <textarea
//                   ref={inputRef}
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={onInputKeyDown}
//                   rows={2}
//                   placeholder="Ask HankSaw..."
//                   className="flex-1 resize-none rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 />
//                 <div className="flex flex-col gap-2">
//                   <button onClick={sendMessage} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Send</button>
//                   <button onClick={() => { setInput(''); inputRef.current?.focus(); }} className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700">Clear</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// function MessageBubble({ role, text }) {
//   const isUser = role === 'user';
//   return (
//     <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
//       <div className={`max-w-[70%] ${isUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'} p-4 rounded-2xl`}>
//         <div className="whitespace-pre-wrap">{text}</div>
//       </div>
//     </div>
//   );
// }

// function TypingIndicator() {
//   return (
//     <div className="flex items-center gap-1">
//       <Dot />
//       <Dot delay={120} />
//       <Dot delay={240} />
//     </div>
//   );
// }

// function Dot({ delay = 0 }) {
//   return (
//     <span className="inline-block w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
//   );
// }


import React, { useState, useEffect, useRef } from "react";

// ChatGPT-like UI with:
// - Persistent storage (localStorage)
// - Streaming responses with blinking dots
// - Enter-to-send + Send button
// - Colorful HankSaw brand, dark mode-friendly sidebar text
// - Chat titles from first user question (max 50 chars)
// - "Clear history" in sidebar

export default function ChatUI() {
  // ---- State ----
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem("hanksaw_chats");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse chats from localStorage", e);
      return [];
    }
  });
  const [activeChatId, setActiveChatId] = useState(() => {
    try {
      return localStorage.getItem("hanksaw_active_chat") || null;
    } catch {
      return null;
    }
  });
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("hanksaw_dark") === "1");
  const messagesEndRef = useRef(null);

  // ---- Effects ----
  useEffect(() => {
    localStorage.setItem("hanksaw_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChatId) localStorage.setItem("hanksaw_active_chat", activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    localStorage.setItem("hanksaw_dark", dark ? "1" : "0");
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    // if active chat was deleted, select the first available
    if (activeChatId && !chats.find(c => c.id === activeChatId)) {
      setActiveChatId(chats[0]?.id || null);
    }
  }, [chats, activeChatId]);

  useEffect(() => {
    // auto-scroll on new content
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId]);

  // ---- Helpers ----
  const currentChat = chats.find(c => c.id === activeChatId) || null;
  const truncate = (t, n = 50) => (t.length > n ? t.slice(0, n) + "…" : t);

  function ensureActiveChat() {
    if (currentChat) return currentChat.id;
    const id = Date.now().toString();
    const newChat = { id, name: "New Chat", messages: [] };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(id);
    return id;
  }

  function startNewChat() {
    const id = Date.now().toString();
    const newChat = { id, name: "New Chat", messages: [] };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(id);
  }

  function clearHistory() {
    if (!confirm("Clear all chats? This cannot be undone.")) return;
    setChats([]);
    setActiveChatId(null);
    localStorage.removeItem("hanksaw_chats");
    localStorage.removeItem("hanksaw_active_chat");
  }

  // ---- Sending & Streaming ----
  async function sendMessage(e) {
    if (e?.preventDefault) e.preventDefault();
    const text = input.trim();
    if (!text) return;

    // Create/ensure chat
    const chatId = ensureActiveChat();

    // Push user message and (empty) assistant placeholder with streaming flag
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      const firstTitle = c.messages.length === 0 ? truncate(text) : c.name;
      return {
        ...c,
        name: firstTitle,
        messages: [
          ...c.messages,
          { id: Date.now().toString(), role: "user", content: text },
          { id: (Date.now()+1).toString(), role: "assistant", content: "", streaming: true }
        ]
      };
    }));

    setInput("");

    // Stream from backend
    let accumulated = "";
    try {
      const response = await fetch(`https://hanksaw-genai-backend.onrender.com/chat?question=${encodeURIComponent(text)}`);
      if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        updateAssistant(chatId, accumulated, true);
      }
      updateAssistant(chatId, accumulated, false);
    } catch (err) {
      console.error("Streaming error:", err);
      updateAssistant(chatId, "⚠️ Sorry, something went wrong while fetching the response.", false);
    }
  }

  function updateAssistant(chatId, text, streaming) {
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      const msgs = [...c.messages];
      // find last assistant message
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === "assistant") {
          msgs[i] = { ...msgs[i], content: text, streaming };
          break;
        }
      }
      return { ...c, messages: msgs };
    }));
  }

  // ---- UI ----
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="px-4 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">HankSaw</div>
          <button onClick={() => setDark(d => !d)} className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="p-3 flex gap-2">
          <button onClick={startNewChat} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ New Chat</button>
          <button onClick={clearHistory} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Clear</button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chats.length === 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 px-2">No chats yet. Start one!</div>
          )}
          <div className="space-y-1">
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-2 rounded-md cursor-pointer truncate ${activeChatId === chat.id ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                {chat.name || "New Chat"}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">{currentChat ? (currentChat.name || "New Chat") : "Welcome"}</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {!currentChat ? (
            <div className="h-full flex items-center justify-center text-xl text-gray-500 dark:text-gray-400">👋 Hi! What are you working on?</div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-3">
              {currentChat.messages.map(m => (
                <MessageBubble key={m.id} role={m.role} text={m.content} streaming={m.streaming} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex items-end gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask HankSaw..."
              rows={2}
              className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
            />
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

function MessageBubble({ role, text, streaming }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`px-4 py-3 rounded-2xl max-w-[75%] whitespace-pre-wrap ${isUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'}`}>
        {text}
        {!isUser && streaming && <BlinkingDots />}
      </div>
    </div>
  );
}

function BlinkingDots() {
  return (
    <span className="inline-flex items-center ml-1 align-middle">
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce ml-1" style={{ animationDelay: '120ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce ml-1" style={{ animationDelay: '240ms' }} />
    </span>
  );
}

