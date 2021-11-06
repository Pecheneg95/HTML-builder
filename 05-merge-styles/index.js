const fs = require('fs');
const path = require('path');
const stylesPath = path.resolve(__dirname, 'styles');
const bundlePath = path.resolve(__dirname, 'project-dist', 'bundle.css');

async function getFileContent(file) {
  let readableStream = fs.createReadStream(file, 'utf-8');
  let content = '';
  for await (const chunk of readableStream) {
    content = content + chunk;
  }
  return content;
}

async function assembleBundle() {
  const arrayFiles = await fs.promises.readdir(stylesPath);
  let content = '';

  for (let i = 0; i < arrayFiles.length; i++) {
    if (path.extname(arrayFiles[i]) !== '.css') {
      continue;
    } else {
      content =
        '\n' +
        content +
        (await getFileContent(path.resolve(stylesPath, arrayFiles[i])));
    }
  }

  const writeStream = fs.createWriteStream(bundlePath);
  writeStream.write(content);
  writeStream.end();
}

assembleBundle();
