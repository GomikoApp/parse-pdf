import db from "../services/firebase";
import data from "../output.json";
import { Category } from "./types";

// make a collection for categories, and each document will be a category
// use auto-generated id for each category

(async () => {
// loop through categories ENUM and add each category to the database
  for (let category in Category) {
    await db.collection("categories").add({
      name: category,
    });
  }

  // // loop through each item in the data array and add it to the database
  // for (let item of data) {
  //   await addDoc(collection(db, "items"), {
  //     name: item.name,
  //     category: item.category,
  //     notes: item.notes,
  //   });
  // }
})();