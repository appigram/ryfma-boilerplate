import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String
  },
  /**
    Timetstamp of payment creation
  */
  createdAt: {
    type: Date
  },
  /**
    The user ID
  */
  userId: {
    type: String
  },
  /**
    Payment status (trialing, active, past_due, canceled, or unpaid)
  */
  status: {
    type: String
  },
  /**
    Timetstamp of start of the current period
  */
  currentPeriodStart: {
    type: Date
  },
  /**
    Timetstamp of end of the current period
  */
  currentPeriodEnd: {
    type: Date
  },
  /**
    Timetstamp of cancellation
  */
  canceledAt: {
    type: Date,
    optional: true
  },
  /**
    Timetstamp of start of the trial period
  */
  trialPeriodStart: {
    type: Date,
    optional: true
  },
  /**
    Timetstamp of end of the trial period
  */
  trialPeriodEnd: {
    type: Date,
    optional: true
  },
  /**
    Discount
  */
  discount: {
    type: Number,
    optional: true
  },
  /**
    Amount of payment
  */
  amount: {
    type: Number
  },
  /**
    Currency of payment
  */
  currency: {
    type: Number,
    defaultValue: 643
  },
  /**
    Interval of payment
  */
  interval: {
    type: String,
    optional: true
  }
})
