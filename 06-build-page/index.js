const fs = require("fs");
const path = require("path");
const stylesPath = path.resolve(__dirname, "styles");
const bundlePath = path.resolve(__dirname, "project-dist", "style.css");
const assetsPath = path.resolve(__dirname, "assets");
const newAssetsPath = path.resolve(__dirname, "project-dist/assets");

async function createFolder() {
  let folder = path.resolve(__dirname, "project-dist");
  await fs.promises.rm(folder, { recursive: true, force: true });
  await fs.promises.mkdir(folder, { recursive: true });
}

async function copyFolder(original, copy) {
  await fs.promises.rm(copy, { recursive: true, force: true });
  await fs.promises.mkdir(copy, { recursive: true });
  const arrayFiles = await fs.promises.readdir(original);
  for (let i = 0; i < arrayFiles.length; i++) {
    fs.stat(path.resolve(original, arrayFiles[i]), (err, stats) => {
      if (!stats.isDirectory()) {
        fs.promises.copyFile(
          path.join(original, arrayFiles[i]),
          path.join(copy, arrayFiles[i])
        );
      } else if (stats.isDirectory()) {
        copyFolder(`${original}\\${arrayFiles[i]}`, `${copy}\\${arrayFiles[i]}`)
      } else if (err) throw err;
    });
  }
}

async function getFileContent(file) {
  let readableStream = fs.createReadStream(file, "utf-8");
  let content = "";
  for await (const chunk of readableStream) {
    content = content + chunk;
  }
  return content;
}

async function assembleBundle() {
  const arrayFiles = await fs.promises.readdir(stylesPath);
  let content = "";

  for (let i = 0; i < arrayFiles.length; i++) {
    if (path.extname(arrayFiles[i]) !== ".css") {
      continue;
    } else {
      content =
        "\n" +
        content +
        (await getFileContent(path.resolve(stylesPath, arrayFiles[i])));
    }
  }

  const writeStream = fs.createWriteStream(bundlePath);
  writeStream.write(content);
  writeStream.end();
}

function searchReplaceFile(reg, replace, fileName) {
  return new Promise((resolve, reject) => {
    const file = fs.createReadStream(fileName, "utf8");
    let newHtml = "";

    file.on("data", (chunk) => {
      newHtml += chunk.toString().replace(reg, replace);
    });

    file.on("end", () => {
      fs.writeFile(fileName, newHtml, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}

const readFileAsPromise = (FilePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(FilePath, "utf8", function (error, data) {
      if (error) reject(err);
      resolve(data);
    });
  });
};

async function createTemplate() {
  let readStream = fs.createReadStream(
    path.resolve(__dirname, "template.html"),
    "utf-8"
  );
  let writeStram = fs.createWriteStream(
    path.resolve(__dirname, "project-dist", "index.html"),
    "utf-8"
  );
  readStream.pipe(writeStram);

  const folderPath = path.join(__dirname, "components");
  const arrayFiles = await fs.promises.readdir(folderPath);
  const fileName = path.resolve(__dirname, "project-dist", "index.html");

  for (let i = 0; i < arrayFiles.length; i++) {
    let extFile = path.extname(arrayFiles[i]);
    let nameFile = path.basename(arrayFiles[i], extFile);
    let reg = new RegExp("{{" + nameFile + "}}");
    let readFilePath = path.resolve(__dirname, "components", arrayFiles[i]);
    let readFile = await readFileAsPromise(readFilePath);
    searchReplaceFile(reg, readFile, fileName);
  }
}

async function buildPage() {
  await createFolder();
  createTemplate();
  assembleBundle();
  copyFolder(assetsPath, newAssetsPath);
}

buildPage();
