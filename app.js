const express = require('express');
const fs = require('fs');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use('/images', express.static(`${__dirname}/public/assets/images`));
app.use('/assets', express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');

const MENU_DB = ['biryani', 'burger', 'butter-chicken', 'dessert', 'dosa', 'idly', 'pasta', 'pizza', 'rice', 'samosa'];

const getImageCount = () => {
  const imageMetaData = [];
  const imageMetaDataFetch = fs.readFileSync('./scripts/deployment/imageMetaData.json', 'utf-8');
  const imageMetaDataJSON = JSON.parse(imageMetaDataFetch);
  for (const obj in imageMetaDataJSON) {
    if (obj === 'total') {
      imageMetaData.push({
        title: 'Total Foodishes',
        count: imageMetaDataJSON[obj]
      });
    } else {
      imageMetaData.push({
        title: obj,
        count: imageMetaDataJSON[obj]
      });
    }
  }
  return imageMetaData;
};

// UI CALLS
app.get('/', (req, res) => {
  // random number generator within MENU_DB array range
  const randomSelector = Math.floor(Math.random() * MENU_DB.length);

  // anyRandomFood is burger
  const anyRandomFood = MENU_DB[randomSelector];

  // random number generator within all burger model images
  // randomFoodDB is the array of objects from the json model
  const randomFoodModel = JSON.parse(fs.readFileSync(`./models/${anyRandomFood}.json`, 'utf8'));
  const randomFoodDB = randomFoodModel[anyRandomFood];

  // catchOfTheDay is the object with image burger101.jpg
  const randomFood = Math.floor(Math.random() * randomFoodDB.length);
  const catchOfTheDay = randomFoodDB[randomFood];

  res.render('foodish', {
    food: {
      image: `${anyRandomFood}/${catchOfTheDay.image}`,
      foodDB: getImageCount()
    }
  });
});

app.get('/images/:food', (req, res) => {
  // food is pizza
  const { food } = req.params;

  let finalFood;

  // (optional) keyword is margherita
  const keyword = req.query.keyword ? req.query.keyword : '';

  // foodPath points to pizza model
  const foodPath = `./models/${food}.json`;

  // check if pizza model exists
  if (fs.existsSync(foodPath)) {
    // get all pizza images from pizza model
    const foodModel = JSON.parse(fs.readFileSync(foodPath, 'utf8'));
    const foodDB = foodModel[food];

    // check if keyword requested
    if (keyword) {
      // filter pizza images matching with keyword margherita
      let filteredFood = [];
      foodDB.forEach((eachFood) => {
        eachFood.keywords.forEach((key) => {
          if (key.toLowerCase() === keyword.toLowerCase()) {
            filteredFood.push(eachFood);
          }
        });
      });
      // randomly select one pizza image if none matched
      if (filteredFood.length === 0) {
        const randomFood = Math.floor(Math.random() * foodDB.length);
        finalFood = foodDB[randomFood];
      } else {
        // randomly select one pizza image from filteredFood
        const randomFood = Math.floor(Math.random() * filteredFood.length);
        finalFood = filteredFood[randomFood];
      }
    } else {
      // randomly select one pizza image
      const randomFood = Math.floor(Math.random() * foodDB.length);
      finalFood = foodDB[randomFood];
    }

    res.render('foodish', { food: { image: `${food}/${finalFood.image}` } });
  } else {
    res.render('notfound', { food: { foodDB: getImageCount() } });
  }
});

// API CALLS
app.get('/api', (req, res) => {
  try {
    const randomSelector = Math.floor(Math.random() * MENU_DB.length);
    const anyRandomFood = MENU_DB[randomSelector];
    const randomFoodModel = JSON.parse(fs.readFileSync(`./models/${anyRandomFood}.json`, 'utf8'));
    const randomFoodDB = randomFoodModel[anyRandomFood];
    const randomFood = Math.floor(Math.random() * randomFoodDB.length);
    const catchOfTheDay = randomFoodDB[randomFood];
    res.status(200).send({
      image: `https://foodish-api.herokuapp.com/images/${anyRandomFood}/${catchOfTheDay.image}`
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.get('/api/images/:food', (req, res) => {
  try {
    const { food } = req.params;
    let finalFood;
    const keyword = req.query.keyword ? req.query.keyword : '';
    const foodPath = `./models/${food}.json`;
    if (fs.existsSync(foodPath)) {
      const foodModel = JSON.parse(fs.readFileSync(foodPath, 'utf8'));
      const foodDB = foodModel[food];
      if (keyword) {
        let filteredFood = [];
        foodDB.forEach((eachFood) => {
          eachFood.keywords.forEach((key) => {
            if (key.toLowerCase() === keyword.toLowerCase()) {
              filteredFood.push(eachFood);
            }
          });
        });
        if (filteredFood.length === 0) {
          const randomFood = Math.floor(Math.random() * foodDB.length);
          finalFood = foodDB[randomFood];
        } else {
          const randomFood = Math.floor(Math.random() * filteredFood.length);
          finalFood = filteredFood[randomFood];
        }
      } else {
        const randomFood = Math.floor(Math.random() * foodDB.length);
        finalFood = foodDB[randomFood];
      }
      res.status(200).send({ image: `https://foodish-api.herokuapp.com/images/${food}/${finalFood.image}` });
    } else {
      res.status(404).send({ error: 'Not found.' });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.get('*', (req, res) => {
  res.status(404).send({ error: 'Not found.' });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
