const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const { default: mongoose } = require('mongoose')
const Client = require('./models/Client')
const Project = require('./models/Project')
const schema = require('./schema/schema')
const cors = require('cors')
const uri = `mongodb+srv://${encodeURIComponent("mrinalseth3959")}:${encodeURIComponent("infant@123")}@cluster0.7jw4x.mongodb.net/projectMamagementApp?retryWrites=true&w=majority`

const app = express()

mongoose.connect(uri)
.then(() => {console.log("DATABASE CONNECTED")})
.catch((err) => {console.log(err)})


app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))


//add client
app.listen(5000, () => {
    console.log('Server listening on port 5000')
})