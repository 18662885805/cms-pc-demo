const path = require("path");
const fs = require("fs");
const cwd = path.resolve();

const SRC = `${cwd}/config/webpack.config.js`;
const DEST = `${cwd}/node_modules/react-scripts/config/webpack.config.js`;

console.log(`[Rewrite] ${SRC} => ${DEST}`);

fs.copyFile(SRC, DEST, (err) => {
  if (err) {
    console.log(`[Rewrite] ${SRC} => ${DEST} failed!`);
    console.log(err);
  } else {
    console.log(`[Rewrite] ${SRC} => ${DEST} success!`);
  }
});
