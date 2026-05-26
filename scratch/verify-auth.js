const bcrypt = require("bcryptjs");

function comparePassword(password, hash) {
  const normalizedHash = hash.replace(/^\$2y\$/, "$2a$");
  return bcrypt.compareSync(password, normalizedHash);
}

const hash = "$2y$10$IE2nzc5ew0rmGNi.emojn.BhLXZqqQfNFd1fEsStbiO4WIUkMd0PG";
const password = "123456";

console.log("Verifying password...");
const isValid = comparePassword(password, hash);
console.log("Password valid:", isValid);
