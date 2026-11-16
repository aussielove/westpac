
import { useState } from 'react'
import '../styles/aiAssistant.css'

const suggestedQuestions = [
  {
    icon: '🎯',
    title: 'Help me reach my holiday goal',
    question: 'How long until I reach my Japan holiday goal?'
  },
  {
    icon: '📱',
    title: 'Find subscriptions I could cut',
    question: 'Which subscriptions could I cut?'
  },
  {
    icon: '🔒',
    title: 'How do I lock my card?',
    question: 'How do I lock my card?'
  }
]

const previousConversations = [
  {
    title: 'Making room for a holiday',
    detail: 'Yesterday · Savings and spending',
    question: 'Help me make more room in my budget for my holiday.'
  },
  {
    title: 'Understanding my spending',
    detail: '14 November · Budget planning',
    question: 'Where did most of my money go?'
  }
]

function getAssistantReply(question) {
  const q = question.toLowerCase()

  if (q.includes('subscription')) {
    return "You currently have 3 recurring subscriptions costing $68.97 per month. Netflix is $25.99, Spotify is $13.99 and iCloud+ is $28.99. Netflix is marked for review because there has been no activity in the last 30 days. If you no longer use it, reviewing that subscription could save you $25.99 per month, or $311.88 per year. Remember to check before cancelling anything."
  }

  if (q.includes('lock') || q.includes('card')) {
    return "If you think your card may be lost or compromised, use your bank's official app or contact the bank immediately. In a real banking app, you would normally find a card management or card security option to temporarily lock your card. Cashflow IQ is a demonstration prototype, so I cannot actually lock your card. Never share your PIN or banking password in this chat."
  }

  if (
    q.includes('fraud') ||
    q.includes('flagged') ||
    q.includes('suspicious') ||
    q.includes('transaction')
  ) {
    return "Your demo security monitor flagged an $850 payment to an unfamiliar online store as high risk. The amount and unfamiliar merchant triggered the alert. If this were a real transaction, check your account activity and contact your bank through its official channels if you don't recognise it. This is simulated activity, not a real bank alert."
  }

  if (
    q.includes('japan') ||
    q.includes('goal') ||
    q.includes('holiday')
  ) {
    return "Your Japan Holiday goal has a target of $10,000, and you've already saved $4,000. That means you have $6,000 remaining. At your planned contribution of $300 per month, you could reach your goal in approximately 20 months. You're already 40% of the way there! You could also consider redirecting some savings from subscriptions or flexible spending towards your holiday."
  }

  if (
    q.includes('spend') ||
    q.includes('money go') ||
    q.includes('expense')
  ) {
    return "You've spent $4,150 from your $4,800 monthly budget so far. Your biggest category is Housing at $1,800, followed by Food & Dining at $1,050. Shopping accounts for another $650. Food and dining could be a good place to review flexible spending."
  }

  if (
    q.includes('2000') ||
    q.includes('save') ||
    q.includes('saving')
  ) {
    return "To save an additional $2,000 over 12 months, you would need to put aside approximately $167 per month. You currently have $650 remaining in your monthly budget. You could consider allocating part of that amount towards your savings goal while keeping some available for unexpected expenses."
  }

  if (
    q.includes('budget') ||
    q.includes('remaining') ||
    q.includes('left')
  ) {
    return "Your monthly budget is $4,800, and you've spent $4,150 so far. That leaves $650 remaining, meaning you've used approximately 86% of your budget. Keep an eye on flexible spending for the rest of the month."
  }

  return "I'm here to help you understand your finances. I can analyse your spending, review subscriptions, help plan savings goals and explain simulated security alerts. What would you like to explore?"
}

function AIAssistant() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const sendMessage = (question) => {
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion) return

    const reply = getAssistantReply(trimmedQuestion)

    setMessages(current => [
      ...current,
      { role: 'user', text: trimmedQuestion },
      { role: 'assistant', text: reply }
    ])

    setInput('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const clearChat = () => {
    setMessages([])
    setInput('')
  }

  return (
    <div className="ai-page">

      {messages.length === 0 ? (
        <section className="ai-welcome-screen">

          <div className="ai-welcome-top">
            <span className="ai-welcome-icon">✦</span>
            <span className="ai-status">● Demo mode</span>
          </div>

          <p className="eyebrow">YOUR PERSONAL FINANCIAL COMPANION</p>

          <h1>Hi Olivia, let's make money simpler.</h1>

          <p className="ai-welcome-message">
            You have <strong>$650 left in your November budget.</strong>
            {' '}I can help you plan ahead, save smarter or check a
            security concern. What would you like to explore?
          </p>

          <div className="ai-question-section">
            <h2>Explore with your AI assistant</h2>

            <div className="ai-question-grid">
              {suggestedQuestions.map(item => (
                <button
                  className="ai-question-card"
                  key={item.title}
                  onClick={() => sendMessage(item.question)}
                >
                  <span className="ai-question-icon">{item.icon}</span>
                  <span>{item.title}</span>
                  <span className="ai-question-arrow">↗</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ai-history-section">
            <h2>Previous conversations</h2>

            {previousConversations.map(item => (
              <button
                className="ai-history-item"
                key={item.title}
                onClick={() => sendMessage(item.question)}
              >
                <span className="ai-history-icon">◷</span>
                <span className="ai-history-details">
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
                <span className="ai-history-arrow">›</span>
              </button>
            ))}
          </div>

          <p className="ai-start-hint">
            Choose a question above to get started
          </p>

        </section>
      ) : (
        <section className="ai-chat-container">

          <div className="ai-chat-heading">
            <div className="ai-avatar">AI</div>

            <div>
              <h2>Cashflow IQ Assistant</h2>
              <p>Here to help with your finances</p>
            </div>

            <div className="ai-heading-actions">
              <span className="ai-status">● Demo mode</span>
              <button
                className="ai-clear-button"
                onClick={clearChat}
              >
                New conversation
              </button>
            </div>
          </div>

          <div className="ai-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ai-message ${message.role}`}
              >
                <div className="message-avatar">
                  {message.role === 'assistant' ? 'AI' : 'You'}
                </div>

                <div className="message-bubble">
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form className="ai-input-area" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything about your finances..."
              aria-label="Ask the AI assistant"
            />

            <button type="submit" disabled={!input.trim()}>
              Send ↑
            </button>
          </form>

        </section>
      )}

      <p className="ai-disclaimer">
        AI demonstration: Responses use illustrative rules and
        fictional financial data. This prototype is not connected
        to real Westpac accounts and does not provide financial advice.
      </p>

    </div>
  )
}

export default AIAssistant
