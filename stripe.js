const qs = require('querystring')

const axios = require('axios')

const config = require('./config')

const STRIPE_API = 'https://api.stripe.com/v1'

const http = axios.create({
  headers: {
    'Authorization': `Bearer ${config.stripeSecret}`
  }
})

const createCharge = ({ amount, customer }) => {
  const charge = {
    amount,
    currency: 'usd',
    customer: customer.id
  }

  console.log(`creating charge: ${amount} for ${customer.id}`)
  return http.post(`${STRIPE_API}/charges`, qs.stringify(charge)).then(res => {
    if (res.status === 200) return res.data
    throw new Error({ status: res.status, statusText: res.statusText })
  })
}

const createCustomer = ({ email, token }) => {
  const customer = {
    email,
    source: token
  }
  console.log('creating customer')

  return http.post(`${STRIPE_API}/customers`, qs.stringify(customer)).then(res => {
    if (res.status === 200) return res.data
    throw new Error({ status: res.status, statusText: res.statusText })
  })
}

const createPlan = ({ amount }) => {
  const plan = {
    amount,
    currency: 'usd',
    id: `monthly-donation-${amount}-usd`,
    interval: 'month',
    name: `Monthly donation of ${amount} USD cents`
  }

  console.log(`creating plan: ${plan.id}`)

  return http.post(`${STRIPE_API}/plans`, qs.stringify(plan)).then(res => {
    if (res.status === 200) return res.data
    throw new Error({ status: res.status, statusText: res.statusText })
  })
}

const createSubscription = ({ customer, plan }) => {
  const sub = {
    customer: customer.id,
    plan: plan.id
  }

  console.log(`creating subscription: ${customer.id} with ${plan.id}`)

  return http.post(`${STRIPE_API}/subscriptions`, qs.stringify(sub)).then(res => {
    if (res.status === 200) return res.data
    throw new Error({ status: res.status, statusText: res.statusText })
  })
}

const createToken = () => {
  const token = {
     'card[number]': '4242424242424242',
     'card[exp_month]': 12,
     'card[exp_year]': 2018,
     'card[cvc]': 123
   }

   console.log('creating token')

   return http.post(`${STRIPE_API}/tokens`, qs.stringify(token)).then(res => {
     if (res.status === 200) return res.data
     throw new Error({ status: res.status, statusText: res.statusText })
   })
}

const fetchAllPlans = () => {
  return http.get(`${STRIPE_API}/plans`).then(res => {
    if (res.status === 200) return res.data.data
    throw new Error({ status: res.status, statusText: res.statusText })
  })
}

const fetchOrCreatePlan = ({ amount }) => {
  return fetchAllPlans().then(plans => {
    return plans.find(plan => plan.amount === +amount)
  }).then(plan => {
    if (!plan) return createPlan({ amount })
    return Promise.resolve(plan)
  })
}

const onetimeDonation = ({ amount, customer }) => {
  return createCharge({ amount, customer })
}

const recurringDonation = ({ amount, customer }) => {
  return fetchOrCreatePlan({ amount }).then(plan => {
    return createSubscription({ customer, plan })
  })
}

module.exports = ({ amount, email, monthly, token }) => {
  return createToken().then(token => {
    return createCustomer({ email, token: token.id }).then(customer => {
      const payload = { amount, customer }
      return (monthly) ? recurringDonation(payload) : onetimeDonation(payload)
    })
  }).catch(err => {
    if (err.response && err.response.data) {
      console.error(err.response.data)
    } else {
      console.error(err.response)
    }
  })
}
