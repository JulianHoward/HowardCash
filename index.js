
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = 3000;

//sesiones
app.set('trust proxy', 1);
app.use(session({
    secret: 'howard',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

//body parser para leer los datos del formulario
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({message: "Invalid data" })
    }

    next();
});

//base de datos
const db = require("./models");
db.sequelize.sync(/*{ force: true }*/).then(() => {
    console.log("db resync");
});

require("./routes")(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
