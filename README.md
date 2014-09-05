# CQ-Pay

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.
```sh
git clone
cd cq-pay
npm install
```

Now you'll want to set up your environment variables for the Stripe integration. We'll need two:

1. `STRIPE_SECRET` - this will be the secret token that Stripe gives you
2. `STRIPE_PLAN` - this will be the id of your stripe plan

You can set your own by modifying the env-sample file with your data and renaming it to `.env`. Then you can run the app with `npm start`

Your app should now be running on [localhost:3000](http://localhost:3000/).
