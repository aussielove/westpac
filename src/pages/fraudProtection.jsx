
import { useState } from 'react'
import '../styles/fraudProtection.css'

const initialTransactions = [
  {
    id: 1,
    merchant: 'Woolworths',
    date: '16 Nov 2026',
    amount: 85.40,
    location: 'Brisbane, Australia',
    risk: 'Low',
    reason: 'Matches your usual shopping pattern.',
    status: 'Safe'
  },
  {
    id: 2,
    merchant: 'Unknown Online Store',
    date: '16 Nov 2026',
    amount: 850.00,
    location: 'Overseas',
    risk: 'High',
    reason: 'Unusually large payment to an unfamiliar merchant.',
    status: 'Needs review'
  },
  {
    id: 3,
    merchant: 'Netflix',
    date: '15 Nov 2026',
    amount: 18.99,
    location: 'Australia',
    risk: 'Low',
    reason: 'Matches your regular subscription payment.',
    status: 'Safe'
  },
  {
    id: 4,
    merchant: 'Electronics Online',
    date: '15 Nov 2026',
    amount: 420.00,
    location: 'Unknown location',
    risk: 'Medium',
    reason: 'New merchant and higher-than-usual transaction amount.',
    status: 'Needs review'
  }
]

const initialActivity = [
  {
    id: 1,
    icon: '🛡️',
    title: 'Transaction monitoring completed',
    description: '4 recent transactions were checked.',
    time: '16 Nov 2026 · 10:15 AM',
    type: 'safe'
  },
  {
    id: 2,
    icon: '⚠️',
    title: 'Unusual transaction detected',
    description: 'An $850 payment to an unfamiliar merchant needs review.',
    time: '16 Nov 2026 · 9:50 AM',
    type: 'warning'
  },
  {
    id: 3,
    icon: '📱',
    title: 'New device sign-in detected',
    description: 'A sign-in from an unrecognised Android device was detected.',
    time: '16 Nov 2026 · 9:42 AM',
    type: 'warning'
  }
]

function FraudProtection({ onBack }) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [deviceStatus, setDeviceStatus] = useState('Needs review')
  const [activity, setActivity] = useState(initialActivity)

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount)

  const addActivity = (title, description, icon, type) => {
    const newActivity = {
      id: Date.now(),
      title,
      description,
      icon,
      time: 'Just now',
      type
    }

    setActivity(current => [newActivity, ...current])
  }

  const updateTransactionStatus = (id, status) => {
    const transaction = transactions.find(item => item.id === id)

    if (!transaction) return

    setTransactions(current =>
      current.map(item =>
        item.id === id ? { ...item, status } : item
      )
    )

    if (status === 'Legitimate') {
      addActivity(
        'Transaction confirmed',
        `${transaction.merchant} · ${formatCurrency(transaction.amount)} was confirmed as legitimate.`,
        '✓',
        'safe'
      )
    } else {
      addActivity(
        'Suspicious transaction reported',
        `${transaction.merchant} · ${formatCurrency(transaction.amount)} was reported for review.`,
        '⚠️',
        'warning'
      )
    }
  }

  const handleDeviceAction = (status) => {
    setDeviceStatus(status)

    if (status === 'Recognised') {
      addActivity(
        'New device recognised',
        'You confirmed that the new Android device sign-in was yours.',
        '✓',
        'safe'
      )
    } else {
      addActivity(
        'Device sign-in reported',
        'The unfamiliar device was flagged for further review in this demo.',
        '⚠️',
        'warning'
      )
    }
  }

  const transactionAlerts = transactions.filter(
    transaction => transaction.status === 'Needs review'
  ).length

  const deviceAlerts = deviceStatus === 'Needs review' ? 1 : 0

  const alerts = transactionAlerts + deviceAlerts

  const highRisk = transactions.filter(
    transaction =>
      transaction.risk === 'High' &&
      transaction.status === 'Needs review'
  ).length

  const attentionTransactions = transactions.filter(
    transaction => transaction.status === 'Needs review'
  )

  return (
    <div className="fraud-page">

      {/* Page heading */}
      <header className="fraud-header">
        <h1>Intelligent Fraud Protection</h1>
        <p>
          Stay informed with proactive monitoring and
          AI-powered security insights.
        </p>
      </header>

      {/* Overview statistics */}
      <section className="fraud-overview">
        <div className="fraud-stat-card">
          <span>Transactions monitored</span>
          <h2>{transactions.length}</h2>
          <p>Recent activity</p>
        </div>

        <div className="fraud-stat-card">
          <span>Alerts requiring review</span>
          <h2>{alerts}</h2>
          <p>Items needing your attention</p>
        </div>

        <div className="fraud-stat-card">
          <span>High-risk alerts</span>
          <h2>{highRisk}</h2>
          <p>Priority attention</p>
        </div>
      </section>

      {/* AI security overview */}
      <section className="fraud-alert-banner">
        <div>
          <h2>AI Security Overview</h2>
          <p>
            {alerts === 0
              ? 'All recent transactions and sign-in alerts have been reviewed.'
              : `We found ${alerts} item(s) that may need your attention.`}
          </p>
        </div>

        <span className="security-icon">🛡️</span>
      </section>

      {/* Things needing attention */}
      <section className="fraud-attention-section">
        <div className="fraud-section-heading">
          <div>
            <span className="fraud-eyebrow">SECURITY CHECK</span>
            <h2>Things That Need Your Attention</h2>
            <p>Review unusual activity and make sure your account is secure.</p>
          </div>

          <span className="fraud-attention-count">
            {alerts} pending
          </span>
        </div>

        {attentionTransactions.length === 0 && deviceAlerts === 0 ? (
          <div className="fraud-all-clear">
            <span>✓</span>
            <div>
              <strong>You're all caught up!</strong>
              <p>There are no outstanding security alerts to review.</p>
            </div>
          </div>
        ) : (
          <div className="fraud-attention-list">

            {attentionTransactions.map(transaction => (
              <div className="fraud-attention-item" key={transaction.id}>
                <div className="fraud-attention-icon danger">
                  !
                </div>

                <div className="fraud-attention-details">
                  <strong>Unusual transaction</strong>
                  <p>
                    {transaction.merchant} · {formatCurrency(transaction.amount)}
                  </p>
                  <span>{transaction.reason}</span>
                </div>

                <span className={`risk-badge ${transaction.risk.toLowerCase()}`}>
                  {transaction.risk} Risk
                </span>
              </div>
            ))}

            {deviceAlerts > 0 && (
              <div className="fraud-attention-item">
                <div className="fraud-attention-icon warning">
                  <span>!</span>
                </div>

                <div className="fraud-attention-details">
                  <strong>New device sign-in</strong>
                  <p>Unrecognised Android device · Overseas</p>
                  <span>We noticed a sign-in from a device not seen before.</span>
                </div>

                <span className="fraud-review-badge">Review</span>
              </div>
            )}

          </div>
        )}
      </section>

      {/* New device sign-in */}
      <section className="fraud-device-section">
        <div className="fraud-section-heading">
          <div>
            <span className="fraud-eyebrow">ACCOUNT SECURITY</span>
            <h2>New Device Sign-in</h2>
            <p>Check whether this recent sign-in was made by you.</p>
          </div>
        </div>

        <div className="fraud-device-card">
          <div className="fraud-device-top">
            <div className="fraud-device-icon">📱</div>

            <div className="fraud-device-info">
              <strong>Android device</strong>
              <span>New device · First sign-in detected</span>
            </div>

            <span className={`device-status ${
              deviceStatus === 'Needs review'
                ? 'pending'
                : deviceStatus === 'Recognised'
                  ? 'recognised'
                  : 'reported'
            }`}>
              {deviceStatus}
            </span>
          </div>

          <div className="fraud-device-details">
            <div>
              <span>Location</span>
              <strong>Overseas</strong>
            </div>

            <div>
              <span>Date and time</span>
              <strong>16 Nov 2026 · 9:42 AM</strong>
            </div>

            <div>
              <span>Device</span>
              <strong>Android mobile</strong>
            </div>
          </div>

          {deviceStatus === 'Needs review' ? (
            <>
              <p className="fraud-device-warning">
                <strong>Was this you?</strong>
                If you don't recognise this activity, report it for review.
              </p>

              <div className="fraud-actions">
                <button
                  className="legitimate-button"
                  onClick={() => handleDeviceAction('Recognised')}
                >
                  Yes, this was me
                </button>

                <button
                  className="report-button"
                  onClick={() => handleDeviceAction('Reported')}
                >
                  No, report it
                </button>
              </div>
            </>
          ) : (
            <p className={
              deviceStatus === 'Recognised'
                ? 'resolved-message'
                : 'reported-message'
            }>
              {deviceStatus === 'Recognised'
                ? '✓ You confirmed this sign-in was yours.'
                : '✓ This sign-in has been flagged for review in this demo.'}
            </p>
          )}
        </div>
      </section>

      {/* Recent transaction activity */}
      <section className="fraud-transactions">
        <div className="fraud-section-heading">
          <div>
            <span className="fraud-eyebrow">PAYMENT MONITORING</span>
            <h2>Recent Transaction Activity</h2>
            <p>Review transactions checked by our simulated AI monitoring.</p>
          </div>
        </div>

        {transactions.map(transaction => (
          <div className="fraud-transaction" key={transaction.id}>
            <div className="transaction-main">
              <div>
                <h3>{transaction.merchant}</h3>
                <p>{transaction.date} · {transaction.location}</p>
              </div>

              <strong>{formatCurrency(transaction.amount)}</strong>
            </div>

            <div className="transaction-risk">
              <span className={`risk-badge ${transaction.risk.toLowerCase()}`}>
                {transaction.risk} Risk
              </span>

              <span className="transaction-status">
                {transaction.status}
              </span>
            </div>

            <p className="risk-reason">
              <strong>AI explanation:</strong> {transaction.reason}
            </p>

            {transaction.status === 'Needs review' && (
              <div className="fraud-actions">
                <button
                  className="legitimate-button"
                  onClick={() =>
                    updateTransactionStatus(transaction.id, 'Legitimate')
                  }
                >
                  Confirm Legitimate
                </button>

                <button
                  className="report-button"
                  onClick={() =>
                    updateTransactionStatus(transaction.id, 'Reported')
                  }
                >
                  Report Suspicious
                </button>
              </div>
            )}

            {transaction.status === 'Legitimate' && (
              <p className="resolved-message">
                ✓ You confirmed this transaction is legitimate.
              </p>
            )}

            {transaction.status === 'Reported' && (
              <p className="reported-message">
                ✓ Transaction marked as suspicious for this demo.
              </p>
            )}
          </div>
        ))}
      </section>

      {/* Security activity timeline */}
      <section className="fraud-activity-section">
        <div className="fraud-section-heading">
          <div>
            <span className="fraud-eyebrow">ACCOUNT HISTORY</span>
            <h2>Security Activity</h2>
            <p>Keep track of recent security checks and actions.</p>
          </div>
        </div>

        <div className="fraud-activity-list">
          {activity.map(item => (
            <div className="fraud-activity-item" key={item.id}>
              <div className={`fraud-activity-icon ${item.type}`}>
                {item.icon}
              </div>

              <div className="fraud-activity-details">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="fraud-disclaimer">
        Demo only: Transactions, sign-in alerts and AI security checks are
        simulated using fictional data. No real banking transactions,
        devices or accounts are monitored or secured.
      </p>

    </div>
  )
}

export default FraudProtection
