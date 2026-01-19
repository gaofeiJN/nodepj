const express = require("express");
const app = express();
app.use(express.urlencoded());

const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

app.get("/", async (req, res) => {
  try {
    const data = await readFile("./db.json", "utf8");
    let users = JSON.parse(data).users;
    res.send(JSON.stringify(users));
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.post("/adduser", async (req, res) => {
  //console.log(`headers : ${req.headers}`);  --- this will print [object Object]
  //console.log(`headers : ${JSON.stringify(req.headers)}`);  --- this will print the headers as a string
  // console.log(req.headers); //  --- this will print the headers as an object
  console.log(`req.headers : ${util.inspect(req.headers)}`); //  --- this will print the headers as an object
  console.log(`req.body : ${util.inspect(req.body)}`); //  --- this will print the body as an object

  try {
    const data = await readFile("./db.json", "utf8");
    let dbObj = JSON.parse(data);
    let idMax = dbObj.users.reduce((max, user) => {
      return user.id > max ? user.id : max;
    }, 0);

    let newUser = {
      id: idMax + 1,
      name: req.body.name,
      age: parseInt(req.body.age),
    };
    dbObj.users.push(newUser);
    dbObj.length = dbObj.users.length;

    await writeFile("./db.json", JSON.stringify(dbObj));
    res.status(200).send(`成功添加用户：${JSON.stringify(newUser)}`);
  } catch (err) {
    res.status(500).send({ err });
  }
});

app.listen(3000, () => {
  console.log("Server starts listening on http://127.0.0.1:3000");
});
