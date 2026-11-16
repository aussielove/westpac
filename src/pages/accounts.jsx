
import { useState } from 'react'
import '../styles/accounts.css'

const accounts = [
  {
    id: 'everyday',
    name: 'Everyday Account',
    type: 'Daily banking',
    number: '•••• 2841',
    balance: 3500,
    icon: '💳',
    color: '#D5002B',
    transactions: [
      { name: 'Woolworths', date: '16 Nov 2026', amount: -85.40 },
      { name: 'Cafe Brisbane', date: '15 Nov 2026', amount: -24.50 },
      { name: 'Salary payment', date: '14 Nov 2026', amount: 3000 },
    ]
  },
  {
    id: 'savings',
    name: 'Savings Account',
    type: 'Personal savings',
    number: '•••• 6192',
    balance: 9000,
    icon: '🏦',
    color: '#269B70',
    transactions: [
      { name: 'Monthly savings', date: '14 Nov 2026', amount: 300 },
      { name: 'Interest earned', date: '01 Nov 2026', amount: 18.50 },
    ]
  },
  {
    id: 'holiday',
    name: 'A Little Time Away',
    type: 'Holiday savings goal',
    number: 'Goal account',
    balance: 4000,
    icon: '✈️',
    color: '#E6B83F',
    transactions: [
      { name: 'Monthly contribution', date: '14 Nov 2026', amount: 300 },
    ]
  },
  {
    id: 'home',
    name: 'Your Own Front Door',
    type: 'First home deposit',
    number: 'Goal account',
    balance: 12000,
    icon: '🏡',
    color: '#986443',
    transactions: [
      { name: 'Monthly contribution', date: '10 Nov 2026', amount: 500 },
    ]
  }
]

const formatMoney = (amount) =>
  amount.toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD'
  })

// Simplified Australian resident income tax calculation, 2026–27.
function calculateIncomeTax(income) {
  if (income <= 18200) return 0
  if (income <= 45000) return (income - 18200) * 0.15
  if (income <= 135000) return 4020 + (income - 45000) * 0.30
  if (income <= 190000) return 31020 + (income - 135000) * 0.37
  return 51370 + (income - 190000) * 0.45
}

// Simplified Medicare levy estimate.
// Actual eligibility and reductions depend on personal circumstances.
function calculateMedicareLevy(income) {
  if (income <= 28501) return 0
  return income * 0.02
}

function Accounts() {
  const [selectedAccount, setSelectedAccount] = useState(null)

  // Tax calculator state
  const [taxStep, setTaxStep] = useState(1)
  const [businessIncome, setBusinessIncome] = useState('')
  const [incomePeriod, setIncomePeriod] = useState('monthly')
  const [businessExpenses, setBusinessExpenses] = useState('')
  const [otherIncome, setOtherIncome] = useState('')
  const [registeredGST, setRegisteredGST] = useState('no')
  const [taxError, setTaxError] = useState('')
  const [taxResult, setTaxResult] = useState(null)

  const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0
  )

  const activeAccount = accounts.find(
    account => account.id === selectedAccount
  )

  const periodsPerYear = {
    monthly: 12,
    quarterly: 4,
    financialYear: 1
  }

  function calculateTax(event) {
    event.preventDefault()
    setTaxError('')

    const income = Number(businessIncome)
    const expenses = Number(businessExpenses)
    const otherAnnual = Number(otherIncome || 0)

    if (!businessIncome || !businessExpenses) {
      setTaxError('Please enter your ABN income and business expenses.')
      return
    }

    if (income < 0 || expenses < 0 || otherAnnual < 0) {
      setTaxError('Please enter amounts of zero or more.')
      return
    }

    if (expenses > income) {
      setTaxError(
        'For this simplified calculator, business expenses cannot exceed business income.'
      )
      return
    }

    const periods = periodsPerYear[incomePeriod]
    const periodProfit = income - expenses
    const annualBusinessProfit = periodProfit * periods
    const totalAnnualIncome = annualBusinessProfit + otherAnnual

    // Calculate the additional tax attributable to the business.
    const incomeTax =
      calculateIncomeTax(totalAnnualIncome) -
      calculateIncomeTax(otherAnnual)

    const medicareLevy =
      calculateMedicareLevy(totalAnnualIncome) -
      calculateMedicareLevy(otherAnnual)

    const annualTax = Math.max(0, incomeTax + medicareLevy)
    const periodTax = annualTax / periods

    // Add a 10% planning buffer to the estimated tax.
    const recommendedSetAside = periodTax * 1.1

    setTaxResult({
      periodProfit,
      incomeTax: Math.max(0, incomeTax) / periods,
      medicareLevy: Math.max(0, medicareLevy) / periods,
      estimatedTax: periodTax,
      recommendedSetAside,
      annualBusinessProfit,
      totalAnnualIncome
    })

    setTaxStep(2)
  }

  function resetTaxCalculator() {
    setTaxStep(1)
    setTaxResult(null)
    setTaxError('')
  }

  return (
    <main className="accounts-page">

      <div className="accounts-header">
        <div>
          <p className="eyebrow">YOUR MONEY, ALL IN ONE PLACE</p>
          <h1>Accounts</h1>
          <p className="description">
            A clearer view of your money, savings and financial goals.
          </p>
        </div>
      </div>

      <div className="insights-notice">
        <span>ℹ</span>
        Demonstration account — all financial data shown is fictional.
      </div>

      {/* Total balance */}
      <section className="accounts-total-card">
        <div>
          <span>Total balance across your accounts</span>
          <h2>{formatMoney(totalBalance)}</h2>
          <p>Across {accounts.length} accounts and savings goals</p>
        </div>
        <span className="accounts-total-icon">◈</span>
      </section>

      {/* Account list */}
      <section className="accounts-section">
        <div className="accounts-section-heading">
          <div>
            <p className="eyebrow">YOUR ACCOUNTS</p>
            <h2>All accounts</h2>
          </div>
          <span>{accounts.length} accounts</span>
        </div>

        <div className="accounts-grid">
          {accounts.map(account => (
            <button
              className={`account-card ${
                selectedAccount === account.id ? 'selected' : ''
              }`}
              key={account.id}
              onClick={() =>
                setSelectedAccount(
                  selectedAccount === account.id ? null : account.id
                )
              }
            >
              <div className="account-card-top">
                <span
                  className="account-icon"
                  style={{ backgroundColor: `${account.color}18` }}
                >
                  {account.icon}
                </span>
                <span className="account-number">{account.number}</span>
              </div>

              <div className="account-card-info">
                <strong>{account.name}</strong>
                <span>{account.type}</span>
              </div>

              <div className="account-card-bottom">
                <span>Available balance</span>
                <strong>{formatMoney(account.balance)}</strong>
              </div>

              <span className="account-view-link">
                {selectedAccount === account.id
                  ? 'Hide activity ↑'
                  : 'View activity →'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Selected account activity */}
      {activeAccount && (
        <section className="account-activity-card">
          <div className="accounts-section-heading">
            <div>
              <p className="eyebrow">ACCOUNT ACTIVITY</p>
              <h2>{activeAccount.name}</h2>
            </div>
            <button
              className="account-close-button"
              onClick={() => setSelectedAccount(null)}
            >
              ✕
            </button>
          </div>

          <div className="account-activity-list">
            {activeAccount.transactions.map((transaction, index) => (
              <div className="account-activity-item" key={index}>
                <div>
                  <strong>{transaction.name}</strong>
                  <span>{transaction.date}</span>
                </div>
                <strong className={
                  transaction.amount > 0 ? 'positive-amount' : ''
                }>
                  {transaction.amount > 0 ? '+' : '-'}
                  {formatMoney(Math.abs(transaction.amount))}
                </strong>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ABN Tax Calculator */}
      <section className="abn-tax-card">
        <div className="abn-tax-heading">
          <div className="abn-tax-icon">🧾</div>
          <div>
            <p className="eyebrow">FOR SOLE TRADERS</p>
            <h2>ABN Tax Calculator</h2>
            <p>
              Understand your estimated business profit and
              plan how much tax to set aside.
            </p>
          </div>
        </div>

        <div className="tax-step-indicator">
          <div className={taxStep === 1 ? 'active' : 'completed'}>
            <span>1</span>
            <strong>Your details</strong>
          </div>
          <div className="tax-step-line"></div>
          <div className={taxStep === 2 ? 'active' : ''}>
            <span>2</span>
            <strong>Your estimate</strong>
          </div>
        </div>

        {taxStep === 1 && (
          <form className="tax-form" onSubmit={calculateTax}>
            <div className="tax-form-intro">
              <h3>Tell us about your business</h3>
              <p>
                Enter your income and expenses for the period
                you want to estimate.
              </p>
            </div>

            <div className="tax-field">
              <label htmlFor="income-period">Income period</label>
              <select
                id="income-period"
                value={incomePeriod}
                onChange={event => setIncomePeriod(event.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="financialYear">
                  Financial Year (1 July – 30 June)
                </option>
              </select>
            </div>

            <div className="tax-field">
              <label htmlFor="business-income">
                ABN business income (AUD)
              </label>
              <input
                id="business-income"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 8000"
                value={businessIncome}
                onChange={event => setBusinessIncome(event.target.value)}
              />
              <span>Enter your gross business income for this period.</span>
            </div>

            <div className="tax-field">
              <label htmlFor="business-expenses">
                Business expenses (AUD)
              </label>
              <input
                id="business-expenses"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 1500"
                value={businessExpenses}
                onChange={event => setBusinessExpenses(event.target.value)}
              />
              <span>
                Include eligible business costs for the same period.
              </span>
            </div>

            <div className="tax-field">
              <label htmlFor="other-income">
                Other annual taxable income (optional)
              </label>
              <input
                id="other-income"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 30000"
                value={otherIncome}
                onChange={event => setOtherIncome(event.target.value)}
              />
              <span>
                For example, salary or other taxable income.
                Leave blank if you have none.
              </span>
            </div>

            <div className="tax-gst-question">
              <label>Are you registered for GST?</label>
              <div className="tax-gst-options">
                <label>
                  <input
                    type="radio"
                    name="gst"
                    value="yes"
                    checked={registeredGST === 'yes'}
                    onChange={event => setRegisteredGST(event.target.value)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="gst"
                    value="no"
                    checked={registeredGST === 'no'}
                    onChange={event => setRegisteredGST(event.target.value)}
                  />
                  No
                </label>
              </div>
              <p>
                {registeredGST === 'yes'
                  ? 'Enter your income and expenses excluding GST, where applicable. This estimate does not calculate your GST obligations.'
                  : 'Enter your business income and expenses as recorded. GST is not calculated in this estimate.'}
              </p>
            </div>

            {taxError && (
              <div className="tax-error">
                {taxError}
              </div>
            )}

            <button className="tax-primary-button" type="submit">
              Calculate My Tax →
            </button>

            <p className="tax-form-disclaimer">
              This is an illustrative estimate. Your actual tax may
              depend on residency, deductions, offsets and other circumstances.
            </p>
          </form>
        )}

        {taxStep === 2 && taxResult && (
          <div className="tax-results">
            <div className="tax-results-intro">
              <span className="tax-result-check">✓</span>
              <h3>Your estimated tax breakdown</h3>
              <p>
                Based on your {incomePeriod === 'monthly'
                  ? 'monthly'
                  : incomePeriod === 'quarterly'
                    ? 'quarterly'
                    : 'financial year'} figures.
              </p>
            </div>

            <div className="tax-profit-card">
              <span>Estimated business profit</span>
              <h2>{formatMoney(taxResult.periodProfit)}</h2>
              <small>Income minus business expenses</small>
            </div>

            <div className="tax-breakdown">
              <div>
                <span>Estimated income tax</span>
                <strong>{formatMoney(taxResult.incomeTax)}</strong>
              </div>
              <div>
                <span>Estimated Medicare levy</span>
                <strong>{formatMoney(taxResult.medicareLevy)}</strong>
              </div>
              <div className="tax-total-row">
                <span>Estimated tax payable</span>
                <strong>{formatMoney(taxResult.estimatedTax)}</strong>
              </div>
            </div>

            <div className="tax-set-aside-card">
              <p className="eyebrow">YOUR SUGGESTED TAX SAVINGS</p>
              <span>Recommended amount to set aside</span>
              <h2>{formatMoney(taxResult.recommendedSetAside)}</h2>
              <small>
                Includes a 10% planning buffer above the estimated tax.
              </small>
            </div>

            <div className="tax-ai-explanation">
              <div className="tax-ai-title">
                <span>✦</span>
                <strong>Your AI tax insight</strong>
              </div>
              <p>
                Your estimated business profit for this period is{' '}
                {formatMoney(taxResult.periodProfit)}. Based on the
                information provided, we estimate that you may need
                to set aside approximately{' '}
                {formatMoney(taxResult.recommendedSetAside)} for tax.
              </p>
              <p>
                Keeping this amount separate from your everyday
                spending can help you prepare for your tax obligations.
              </p>
              <small>
                This is an illustrative AI-style explanation generated
                from your calculator results, not personalised tax advice.
              </small>
            </div>

            <div className="tax-assumptions">
              <strong>Important assumptions</strong>
              <ul>
                <li>
                  Uses simplified 2026–27 Australian resident tax rates.
                </li>
                <li>
                  Assumes you are eligible for the full tax-free threshold.
                </li>
                <li>
                  Assumes your other taxable income is as entered.
                </li>
                <li>
                  Medicare levy is estimated at 2% where applicable.
                </li>
                <li>
                  Does not include GST, HELP debts, tax offsets,
                  deductions beyond entered expenses or other adjustments.
                </li>
              </ul>
            </div>

            <button
              className="tax-primary-button"
              onClick={resetTaxCalculator}
            >
              ← Edit My Details
            </button>
          </div>
        )}
      </section>

      <p className="accounts-disclaimer">
        Cashflow IQ concept demonstration. All balances and transactions
        are fictional. Tax calculations are simplified estimates,
        not professional tax advice.
      </p>

    </main>
  )
}

export default Accounts
