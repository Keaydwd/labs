export default defineEventHandler((event) => {
  const query = getQuery(event)
  const planName = String(query.plan || 'Team')
  const isAnnual = query.annual === 'true'

  const plans = {
    Starter: {
      name: 'Starter', monthlyPrice: 83.25, annualPrice: 999, originalAnnual: 1188, savings: 189, members: '0', memberExtra: '$35/month', exports: '10,000', exportExtra: '$0.02 each', skipTraces: '500', skipExtra: '$0.08 each', gradient: 'from-green-500 to-cyan-400'
    },
    Team: {
      name: 'Team', monthlyPrice: 207.50, annualPrice: 2490, originalAnnual: 2988, savings: 498, members: '2', memberExtra: '$25/month', exports: '50,000', exportExtra: '$0.01 each', skipTraces: '1,000', skipExtra: '$0.08 each', gradient: 'from-green-500 to-cyan-400'
    },
    Business: {
      name: 'Business', monthlyPrice: 457.50, annualPrice: 5490, originalAnnual: 6588, savings: 1098, members: '6', memberExtra: '$20/month', exports: '100,000', exportExtra: '$0.01 each', skipTraces: '2,000', skipExtra: '$0.08 each', gradient: 'from-green-500 to-cyan-500'
    }
  }

  const plan = plans[planName as keyof typeof plans] || plans['Team']

  const displayMonthly = isAnnual ? plan.monthlyPrice : plan.monthlyPrice * 1.2
  const totalDue = isAnnual ? plan.annualPrice : displayMonthly

  return {
    ...plan,
    isAnnual,
    displayMonthly: displayMonthly.toFixed(2),
    totalDue: totalDue.toFixed(2),
    billingText: isAnnual ? 'Annual' : 'Monthly'
  }
})
