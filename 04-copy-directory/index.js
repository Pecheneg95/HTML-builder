const fs = require("fs");
const path = require("path");

copyFolder(
  path.resolve(__dirname, "files"),
  path.resolve(__dirname, "files-copy")
);

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
      } else if (err) throw err;
    });
  }
}
