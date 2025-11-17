export function calculateNetWorth({ cash = 0, savings = 0, portfolioValue = 0, realEstateValue = 0 }) {
  return cash + savings + portfolioValue + realEstateValue
}

export function calculateLoanPayment(principal, annualRate, termMonths) {
  if (annualRate === 0) return principal / termMonths

  const monthlyRate = annualRate / 12
  const numerator = principal * monthlyRate * (1 + monthlyRate) ** termMonths
  const denominator = (1 + monthlyRate) ** termMonths - 1

  return numerator / denominator
}

export function calculatePortfolioReturn(transactions = []) {
  const gains = transactions.reduce((acc, txn) => acc + (txn.realizedPnL || 0), 0)
  const invested = transactions.reduce((acc, txn) => acc + (txn.totalCost || 0), 0)

  return invested === 0 ? 0 : gains / invested
}
