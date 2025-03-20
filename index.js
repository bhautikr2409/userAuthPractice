require("dotenv").config()

const express = require("express")
const app = express()
const { DB_URL, DB_NAME, PORT } = process.env
const port = PORT || 3001
const cors = require("cors")
const dbConnect = require("./dbConnect")
const userRouter = require("./routes/user.routes")
const cookie = require("cookie-parser")
const path = require("path")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(cookie())
app.use(cors())
app.use(express.json())

app.use("/api/user", userRouter)

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/about", (req, res) => {
    res.send("this is about page")
})



dbConnect(DB_URL, DB_NAME)
    .then((res) => { console.log("DB connected") })
    .catch((err) => { console.log("error in db connection>>>>", err.message) })


app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})