const express = require("express");
const cors = require("cors");
const request = require("request");

const app = express();
const port = 3000;

app.use(express.static("static"));

app.use(cors());

app.get("/cors", (req, res) => {
  const url = req.originalUrl.slice(6);
  console.log(`CORS Proxy get ${url}`);
  request(url).pipe(res);
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
