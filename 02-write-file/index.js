const fs = require("fs");
const path = require("path");
const readline = require("readline");
const filePath = path.join(__dirname, "text.txt");

let writeableStream = fs.createWriteStream(filePath);

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

fs.open(filePath, "w", (err) => {
  if (err) throw err;
  console.log("Введите текст: ");
  rl.prompt();
});

rl.addListener("line", (data) => {
  if (data.toString().trim() === "exit") {
    console.log("Досвидания!");
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });
    process.exit();
  } else {
    writeableStream.write(`${data} \n`);
    rl.prompt();
  }
});

rl.addListener("SIGINT", () => {
  console.log("Досвидания!");
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
  process.exit();
});
