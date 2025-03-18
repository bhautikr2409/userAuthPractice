require("dotenv").config()

const express = require("express")
const app = express()
const { DB_URL, DB_NAME, PORT } = process.env
const port = PORT || 3001
const cors = require("cors")
const dbConnect = require("./dbConnect")
const userRouter = require("./routes/user.routes")

app.use(cors())
app.use(express.json())
app.use("/api/user", userRouter)

app.get("/", (req, res) => {
    res.end("app running...")
})


dbConnect(DB_URL, DB_NAME)
    .then((res) => { console.log("DB connected") })
    .catch((err) => { console.log("error in db connection>>>>", err.message) })


app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})