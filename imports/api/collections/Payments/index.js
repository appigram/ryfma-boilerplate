import { Mongo } from 'meteor/mongo'
import PaymentSchema from './Schema'

const Payments = new Mongo.Collection('payments')

Payments.attachSchema(PaymentSchema)

export default Payments
