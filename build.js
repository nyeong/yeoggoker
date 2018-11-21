const fs = require("fs");
const toml = require("toml");

fs.readFile("data.toml", "utf-8", (err, data) => {
  if (err) throw err;
  let json = JSON.stringify(toml.parse(data));
  fs.writeFileSync("data.js", "var data=" + json, err => {
    if (err) throw err;
    console.log("data.js has been created.");
  });
});
