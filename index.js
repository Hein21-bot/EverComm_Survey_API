const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const appRouter = require("./route")
// const helmet = require('helmet')
// const morgan = require('morgan')
const app = express()
const port = 7878;

app.use(express.static(path.join(__dirname, "public")));
// app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// app.use(morgan("combined"));
// app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use("/api/v1", appRouter);


app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
