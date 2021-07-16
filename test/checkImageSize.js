const core = require("@actions/core");
const sizeOf = require("image-size");
const fs = require("fs");

try {
  let menuDB = fs.readdirSync(`./public/assets/images`);
  let dimensions;
  let eachFoodish;
  menuDB.forEach((eachFoodDB) => {
    let foodDB = fs.readdirSync(`./public/assets/images/${eachFoodDB}`);
    foodDB.forEach((eachFood) => {
      eachFoodish = `./public/assets/images/${eachFoodDB}/${eachFood}`;
      // check if image filename matches conventions e.g. /pizza/pizza40.jpg
      if (!eachFood.includes(eachFoodDB)) {
        throw new Error(
          `Failed: Image filename conventions did not match for ${eachFoodish}: should be ${eachFoodDB}{number}.jpg`
        );
      }

      dimensions = sizeOf(eachFoodish);

      // check if image file extension is .jpg
      if (dimensions.type !== "jpg") {
        throw new Error(
          `Failed: Image format requirements did not match for ${eachFoodish}: ${JSON.stringify(
            dimensions,
            null,
            2
          )}`
        );
      } else if (dimensions.width < 500 && dimensions.height < 500) {
        // check if image dimensions match requirements
        throw new Error(
          `Failed: Image dimensions requirements did not match for ${eachFoodish}: ${JSON.stringify(
            dimensions,
            null,
            2
          )}`
        );
      }
    });
  });
  core.setOutput("Success", "Image Size check passed!");
} catch (error) {
  core.setFailed(error.message ? error.message : error);
}
