const core = require('@actions/core');
const fs = require('fs');

try {
  // count and update images metadata on every deployment
  let imageMetaData = {};
  let totalCount = 0;
  let menuDB = fs.readdirSync(`./public/assets/images`);
  menuDB.forEach((eachFoodDB) => {
    let foodDB = fs.readdirSync(`./public/assets/images/${eachFoodDB}`);
    totalCount += foodDB.length;
    imageMetaData[eachFoodDB] = foodDB.length;
  });
  imageMetaData['total'] = totalCount;
  fs.writeFileSync('./scripts/deployment/imageMetaData.json', JSON.stringify(imageMetaData, null, 2));
  console.log('Success: Image count updated!');
} catch (error) {
  core.setFailed(error.message ? error.message : error);
}
