const mysql = require("mysql");
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "newpropcrm",
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Connected to DB");
});

module.exports = conn;
