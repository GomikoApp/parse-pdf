import { DataEntry, PdfReader } from "pdfreader";
import { Category, Item, Entry } from "./types";
import { exit } from "process";
import fs from "fs";

const reader = new PdfReader({});
const pdfPath = "uploads/alphabetical_listing.pdf";

const items: DataEntry[] | Entry[] = [];
const skipRows = [1.7850, 5.34];
const skipAlphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const writeToJSON = (items: any) => {
  //rewrite the file if it exists
  fs.writeFileSync("output.json", JSON.stringify(items, null, 2));
}

const groupByY = (items: Entry[]): [Entry][] => {
  const grouped: [Entry][] = [];
  let currentGroup = -1;
  let previousY = 0;
  for (let item of items) {
    if (!item || !item.y) continue;
    if (skipRows.includes(item.y) || item.y < 1.9) continue;
    if (item.y === previousY || Math.abs(item.y - previousY) < 1) grouped[currentGroup].push(item);
    else {
      // if current group is not -1, merge the items that are in x > 3 and x < 13 range into one item
      if (currentGroup !== -1) {
        const mergedItems = grouped[currentGroup].filter((entry) => entry.x >= 3 && entry.x <= 13);
        if (mergedItems.length > 1) {
          const mergedText = mergedItems.map((entry) => entry.text).join(" ");
          const mergedEntry = {
            x: mergedItems[0].x,
            y: mergedItems[0].y,
            w: mergedItems[0].w,
            text: mergedText,
          };
          grouped[currentGroup] = [...grouped[currentGroup].filter((entry) => entry.x < 3 || entry.x > 13)] as [Entry];
          grouped[currentGroup].push(mergedEntry);
        }
      }

      currentGroup++;
      grouped[currentGroup] = [item];
    }
    previousY = item.y;
  }

  return grouped;
}

// read json from output.json and count the number of items in each alphabetical category
const countAlphabeticalCategories = () => {
  const data = JSON.parse(fs.readFileSync("output.json", "utf-8"));
  const categories: {[x: string | number]: number} = {};
  for (let item of data) {
    const firstLetter = item.name[0].toUpperCase();
    if (!categories[firstLetter]) categories[firstLetter] = 1;
    else categories[firstLetter]++;
  }
  console.log(categories);
}

(async () => {
 await new Promise((resolve, reject) => {
    reader.parseFileItems(pdfPath, (err, item) => {
      if (err) reject(err);
      if (!item) {
        resolve(null);
        return;
      }

      if (item.page) console.log(`Processing page ${item.page}`);
      
      items.push(item as Entry);
    });
  });

  let groups = groupByY(items as Entry[])
  const itemsList: Item[] = [];
  for (let group of groups) {
    let item: Item = {} as Item;
    for (let entry of group) {
      if (skipAlphabet.includes(entry.text)) continue;
      if (entry.x >= 3 && entry.x <= 4) item.name = entry.text;
      if (entry.x >= 15 && entry.x <= 16) item.category = entry.text as Category;
      if (entry.x >= 20 && entry.x < 25) item.notes = entry.text;
    }
    if (item.name && item.category) itemsList.push(item);
  }

  itemsList.splice(-1,1);


  writeToJSON(itemsList);
  countAlphabeticalCategories()
})();
