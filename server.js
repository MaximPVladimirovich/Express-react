require(`dotenv`).config();
let { PORT = 3000 } = process.env.PORT;
const express = require(`express`);
const cors = require(`cors`)
const app = express();
const mongoose = require(`mongoose`)

// ---   Middleware
// Prevents cors errors, open access to all origins
app.use(cors());
// Parse json requests
app.use(express.json());

// ---     Connect to database
let db_url = process.env.MONGODB_URL
let db = mongoose.connection;
mongoose.connect(db_url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

// ---    Check if conenction is successful
db.on(`error`, console.error.bind(console, `connection error`));
db.once(`open`, function () {
    console.log(`connected to database`)
})

// ---   Model
let PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})
const People = mongoose.model(`People`, PeopleSchema)


app.get(`/`, function (req, res) {
    res.send(`hello world`)
})

// ---   Get all people route
app.get(`/people`, async function (req, res) {
    try {
        res.json(await People.find({}));
    } catch (error) {
        res.status(400).json(error)
    }
})

// ---   Create a person
app.post(`/people`, async function (req, res) {
    try {
        res.json(await People.create(req.body));
    } catch (error) {
        res.status(400).json(error)
    }
})


// Delete a person
app.delete(`/people/:id`, async function (req, res) {
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

// ---   Update a person
app.get(`/people/:id`, async function (req, res) {
    try {
        res.json(await People.findById(req.params.id, req.body, { new: true }))
    } catch (error) {
        res.status(400).json(error)
    }
})


// Listen on port
app.listen(PORT, function () {
    console.log(`listening on port ${PORT}`)
})