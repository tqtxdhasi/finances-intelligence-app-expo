const fs = require("fs");

const inputFile = "categories.json";
const outputFile = "categories_clean.json";

const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));

function removeKeys(obj, keysToRemove) {
  if (Array.isArray(obj)) {
    obj.forEach((item) => removeKeys(item, keysToRemove));
  } else if (obj && typeof obj === "object") {
    keysToRemove.forEach((key) => delete obj[key]);
    Object.values(obj).forEach((value) => removeKeys(value, keysToRemove));
  }
}

removeKeys(data, ["return_reasons", "attributes"]);
fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
console.log("Done!");
