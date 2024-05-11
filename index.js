const cheerio = require("cheerio");
const axios = require("axios");
const xlsx = require("xlsx"); // Importing xlsx library

async function fun() {
  try {
    let response = await axios.get("https://www.bewakoof.com/men-clothing");

    const $ = cheerio.load(response.data);

    const products = $(".containerHeight");
    let data = [];

    products.each((index, element) => {
      const name = $(element).find(".clr-shade4.h3-p-name").text().trim();
      const price = $(element)
        .find(".discountedPriceText.clr-p-black")
        .text()
        .trim();
      const rating = $(element)
        .find(".discountedPriceText.clr-shade-3")
        .text()
        .trim();

      data.push({ Name: name, Price: price, Rating: rating });
    });

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Products");
    xlsx.writeFile(wb, "bewakoof_products.xlsx");

    console.log("Data exported to bewakoof_products.xlsx");
  } catch (error) {
    console.error("Error:", error);
  }
}

fun();
