
import { useState } from 'react'
import '../styles/financialJourney.css'

function FinancialJourney() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Japan Holiday',
      target: 10000,
      saved: 4000,
      monthly: 300
    }
  ])

  const totalSaved = goals.reduce(
    (total, goal) => total + Number(goal.saved),
    0
    )

    const totalTarget = goals.reduce(
    (total, goal) => total + Number(goal.target),
    0
    )

    const overallProgress = totalTarget > 0
    ? Math.min((totalSaved / totalTarget) * 100, 100)
    : 0

    const activeGoals = goals.filter(
    goal => goal.saved < goal.target
    ).length

  // Form values for creating a new goal
  const [newGoalName, setNewGoalName] = useState('')
  const [newTarget, setNewTarget] = useState(5000)
  const [newSaved, setNewSaved] = useState(0)
  const [newMonthly, setNewMonthly] = useState(300)

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0
    }).format(amount)

  // Add a new savings goal
  const addGoal = (e) => {
    e.preventDefault()

    if (!newGoalName.trim() || newTarget <= 0) {
      return
    }

    const newGoal = {
      id: Date.now(),
      name: newGoalName.trim(),
      target: Number(newTarget),
      saved: Number(newSaved),
      monthly: Number(newMonthly)
    }

    setGoals([...goals, newGoal])

    // Reset the form
    setNewGoalName('')
    setNewTarget(5000)
    setNewSaved(0)
    setNewMonthly(300)
  }

  // Update an individual goal's monthly contribution
  const updateMonthly = (id, value) => {
    setGoals(currentGoals =>
      currentGoals.map(goal =>
        goal.id === id
          ? { ...goal, monthly: Number(value) }
          : goal
      )
    )
  }

  // Remove a savings goal
  const removeGoal = (id) => {
    setGoals(currentGoals =>
      currentGoals.filter(goal => goal.id !== id)
    )
  }

  return (
    <div className="app">
      <main className="page-container financial-journey-page">

        {/* Page Header */}
        <header className="page-header">
          <p className="eyebrow">YOUR FINANCIAL FUTURE</p>

          <h1>My Financial Journey</h1>

          <p>
            Turn your financial goals into achievable plans.
            Track your progress and see how your savings grow.
          </p>
        </header>

        {/* Savings Overview */}
        <section className="savings-overview">

        <div className="overview-card">
            <span>Total saved</span>
            <h2>{formatCurrency(totalSaved)}</h2>
            <p>Across all your goals</p>
        </div>

        <div className="overview-card">
            <span>Total target</span>
            <h2>{formatCurrency(totalTarget)}</h2>
            <p>Your combined savings target</p>
        </div>

        <div className="overview-card">
            <span>Overall progress</span>
            <h2>{overallProgress.toFixed(0)}%</h2>
            <div className="overview-progress">
            <div style={{ width: `${overallProgress}%` }} />
            </div>
            <p>{activeGoals} active savings goals</p>
        </div>

        </section>

        {/* Savings Goals */}
        <section>
          <div className="journey-section-heading">
            <div>
              <h2>My Savings Goals</h2>
              <p>Manage and track your financial goals.</p>
            </div>

            <span className="goal-count">
              {goals.length} {goals.length === 1 ? 'Goal' : 'Goals'}
            </span>
          </div>

          <div className="goal-list">

            {goals.map(goal => {
              const remaining = Math.max(
                goal.target - goal.saved,
                0
              )

              const progress = Math.min(
                (goal.saved / goal.target) * 100,
                100
              )

              const monthsNeeded =
                remaining === 0
                  ? 0
                  : goal.monthly > 0
                    ? Math.ceil(remaining / goal.monthly)
                    : null

              return (
                <article className="journey-card" key={goal.id}>

                  <div className="goal-card-header">
                    <div>
                        <p className="goal-category">SAVINGS GOAL</p>
                        <h2>{goal.name}</h2>

                        <span className={`goal-status ${remaining === 0 ? 'completed' : ''}`}>
                        {remaining === 0 ? '✓ Goal achieved' : '● In progress'}
                        </span>
                    </div>

                    <button
                        className="remove-goal"
                        onClick={() => removeGoal(goal.id)}
                        aria-label={`Remove ${goal.name}`}
                    >
                        Remove
                    </button>
                  </div>

                  <div className="goal-amounts">
                    <div>
                      <span>Current savings</span>
                      <h3>{formatCurrency(goal.saved)}</h3>
                    </div>

                    <div>
                      <span>Target amount</span>
                      <h3>{formatCurrency(goal.target)}</h3>
                    </div>
                  </div>

                  <div className="progress-heading">
                    <span>Your savings progress</span>
                    <strong>{progress.toFixed(0)}%</strong>
                  </div>

                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    >
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="savings-summary">
                    <span>{formatCurrency(goal.saved)} saved</span>
                    <span>{formatCurrency(remaining)} to go</span>  
                  </div>

                  <div className="goal-contribution">
                    <label>
                      Monthly contribution
                    </label>

                    <h3>{formatCurrency(goal.monthly)}</h3>

                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={goal.monthly}
                      onChange={(e) =>
                        updateMonthly(goal.id, e.target.value)
                      }
                    />

                    <div className="savings-summary">
                      <span>$0</span>
                      <span>$2,000 per month</span>
                    </div>
                  </div>

                  <div className="goal-projection">
                    <div>
                        <span>Estimated time to reach your goal</span>

                        <h3>
                        {monthsNeeded === 0
                            ? 'Goal achieved!'
                            : monthsNeeded === null
                            ? 'Set a contribution'
                            : `${monthsNeeded} months`}
                        </h3>
                    </div>

                    {monthsNeeded !== null && monthsNeeded > 0 && (
                        <p>
                        Save {formatCurrency(goal.monthly)} each month to reach
                        your goal in approximately {monthsNeeded} months.
                        </p>
                    )}
                  </div>
                </article>
              )
            })}

          </div>

          {goals.length === 0 && (
            <div className="journey-card">
              <h2>No savings goals yet</h2>
              <p>Create your first goal below to start planning.</p>
            </div>
          )}
        </section>

        {/* Create New Goal */}
        <section className="journey-card create-goal-section">

          <p className="eyebrow">PLAN SOMETHING NEW</p>

          <h2>Create a New Savings Goal</h2>

          <p className="calculator-description">
            Set a target and build a savings plan that works
            for your financial situation.
          </p>

          <form onSubmit={addGoal} className="goal-form">

            <label>Goal name</label>
            <input
              type="text"
              placeholder="e.g. New Car"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              required
            />

            <label>Target amount (AUD)</label>
            <input
              type="number"
              min="1"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              required
            />

            <label>Current savings (AUD)</label>
            <input
              type="number"
              min="0"
              value={newSaved}
              onChange={(e) => setNewSaved(e.target.value)}
              required
            />

            <label>Monthly contribution (AUD)</label>
            <input
              type="number"
              min="0"
              value={newMonthly}
              onChange={(e) => setNewMonthly(e.target.value)}
              required
            />

            <button type="submit" className="tile-action">
              + Create Savings Goal
            </button>

          </form>
        </section>

        <p className="demo-disclaimer">
          Savings projections are illustrative estimates based on
          entered amounts. They do not include interest, fees,
          withdrawals or changes in income.
        </p>

      </main>
    </div>
  )
}

export default FinancialJourney
