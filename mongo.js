
const mongoose = require('mongoose')

// Komentoriviparametrit
const password = process.argv[2]

// MongoDB Atlasin oma yhteysmerkkijono.
const connectionString = 'mongodb+srv://nicopelaa5_db_user:<password>@cluster0.ye3b4lk.mongodb.net/phonebook?retryWrites=true&w=majority'

const url = connectionString.replace(
  '<password>',
  encodeURIComponent(password)
)

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const main = async () => {
  try {
    await mongoose.connect(url)

    if (process.argv.length === 3) {
      // Listataan kaikki yhteystiedot
      const persons = await Person.find({})

      console.log('phonebook:')

      persons.forEach(person => {
        console.log(person.name, person.number)
      })
    } else if (process.argv.length === 5) {
      // Lisätään uusi yhteystieto
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      })

      await person.save()

      console.log(
        `added ${person.name} number ${person.number} to phonebook`
      )
    } else {
      console.log('Give password and optionally name and number')
    }
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await mongoose.connection.close()
  }
}

main()
