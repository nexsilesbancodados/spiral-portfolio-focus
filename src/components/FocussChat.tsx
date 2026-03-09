import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

type Message = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/focuss-chat`;

export function FocussChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    let assistantSoFar = '';

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Erro ${resp.status}`);
      }

      if (!resp.body) throw new Error('No stream body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (e: any) {
      console.error('FOCUSS chat error:', e);
      upsertAssistant(`⚠️ ${e.message || 'Erro ao conectar com a IA. Tente novamente.'}`);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    'O que a FOCUSS DEV faz?',
    'Me ajude com React',
    'Explique Machine Learning',
    'Dicas de UI/UX Design',
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(335 75% 55%), hsl(25 95% 55%))' }}>
            <span className="text-white text-sm font-bold">F</span>
          </div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-foreground tracking-tight">FOCUSS</h3>
        </div>
        <p className="text-muted-foreground text-sm">Assistente de IA da FOCUSS DEV</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 md:px-4 gta-vi-scroll" style={{ scrollbarWidth: 'thin' }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(335 75% 55% / 0.2), hsl(25 95% 55% / 0.2))' }}>
              <span className="text-3xl">✨</span>
            </div>
            <p className="text-muted-foreground text-center text-sm max-w-md">
              Olá! Sou o <strong className="text-foreground">FOCUSS</strong>, sua IA assistente. Pergunte sobre desenvolvimento, design, IA ou qualquer tema tech.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="text-xs px-3 py-2 rounded-full border border-border/30 text-muted-foreground hover:text-foreground hover:border-accent/50 transition-all duration-300"
                  style={{ background: 'hsl(var(--card) / 0.5)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'order-1' : 'order-1'}`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(335 75% 55%), hsl(25 95% 55%))' }}>
                    <span className="text-white text-[9px] font-bold">F</span>
                  </div>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-[family-name:var(--font-display)]">FOCUSS</span>
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'text-foreground/90 rounded-bl-sm border border-border/20'
                }`}
                style={{
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, hsl(335 75% 55%), hsl(25 95% 55%))'
                    : 'hsl(var(--card) / 0.6)',
                }}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_code]:bg-background/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-vice-teal [&_pre]:bg-background/50 [&_pre]:rounded-lg [&_pre]:p-3 [&_ul]:space-y-1 [&_ol]:space-y-1 [&_li]:text-foreground/80">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-sm border border-border/20" style={{ background: 'hsl(var(--card) / 0.6)' }}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-vice-pink/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-vice-sunset/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-vice-teal/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="mt-4 px-2 md:px-4">
        <div className="relative flex items-end gap-2 rounded-2xl border border-border/30 px-4 py-3 transition-all duration-300 focus-within:border-accent/50" style={{ background: 'hsl(var(--card) / 0.5)' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte ao FOCUSS..."
            rows={1}
            className="flex-1 bg-transparent text-foreground text-sm resize-none outline-none placeholder:text-muted-foreground/50 max-h-32"
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30"
            style={{
              background: input.trim()
                ? 'linear-gradient(135deg, hsl(335 75% 55%), hsl(25 95% 55%))'
                : 'hsl(var(--muted) / 0.5)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground/40 mt-2 font-[family-name:var(--font-display)] tracking-wider">
          FOCUSS AI • Powered by Gemini
        </p>
      </div>
    </div>
  );
}
