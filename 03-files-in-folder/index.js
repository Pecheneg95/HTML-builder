const fs = require("fs");
const path = require("path");
const folderPath = path.join(__dirname, "secret-folder");

const filesInFolder = async function () {
  const arrayFiles = await fs.promises.readdir(folderPath);

  for (let i = 0; i < arrayFiles.length; i++) {
    let extFile = path.extname(arrayFiles[i]);
    let nameFile = path.basename(arrayFiles[i], extFile);
    fs.stat(path.resolve(folderPath, arrayFiles[i]), (err, stats) => {
      if (!stats.isDirectory()) {
        console.log(
          `${nameFile} - ${extFile.slice(1)} - ${
            Math.ceil((stats.size / 1024) * 1000) / 1000
          } kb`
        );
      } else if (err) throw err;
    });
  }
};

filesInFolder();
