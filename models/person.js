const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDb')
  })
  .catch((error) => {
    console.log('error connecting to MongoDb', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least three characters long, got {VALUE}'],
    required: true
  },
  number: {
    type: String,
    minLength: [
      8,
      'The number must be at least 8 characters long, got {VALUE}'
    ],
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{6,}/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
