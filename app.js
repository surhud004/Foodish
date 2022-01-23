const express = require('express');
const fs = require('fs');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use('/images', express.static(`${__dirname}/public/assets/images`));
app.use('/assets', express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');

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
  // menuDB is ['biryani', 'burger', 'pizza']
  const menuDB = fs.readdirSync('./public/assets/images');

  // random number generator within menuDB array range
  const randomSelector = Math.floor(Math.random() * menuDB.length);

  // anyRandomFood is burger
  const anyRandomFood = menuDB[randomSelector];

  // random number generator within all burger images
  const randomFoodDB = fs.readdirSync(`./public/assets/images/${anyRandomFood}`);

  // catchOfTheDay is burger101.jpg
  const catchOfTheDay = Math.floor(Math.random() * randomFoodDB.length + 1);

  res.render('foodish', {
    food: {
      image: `${anyRandomFood}/${anyRandomFood}${catchOfTheDay}.jpg`,
      foodDB: getImageCount()
    }
  });
});

app.get('/images/:food', (req, res) => {
  // food is pizza
  const { food } = req.params;

  // foodPath points to pizza directory
  const foodPath = `./public/assets/images/${food}`;

  // check if pizza directory exists
  if (fs.existsSync(foodPath)) {
    // get all pizza images
    const foodDB = fs.readdirSync(foodPath);

    // randomly select one pizza image
    const randomFood = Math.floor(Math.random() * foodDB.length + 1);

    res.render('foodish', { food: { image: `${food}/${food}${randomFood}.jpg` } });
  } else {
    res.render('notfound', { food: { foodDB: getImageCount() } });
  }
});

// API CALLS
app.get('/api', (req, res) => {
  try {
    const menuDB = fs.readdirSync('./public/assets/images');
    const randomSelector = Math.floor(Math.random() * menuDB.length);
    const anyRandomFood = menuDB[randomSelector];
    const randomFoodDB = fs.readdirSync(`./public/assets/images/${anyRandomFood}`);
    const catchOfTheDay = Math.floor(Math.random() * randomFoodDB.length + 1);
    res.status(200).send({
      image: `https://foodish-api.herokuapp.com/images/${anyRandomFood}/${anyRandomFood}${catchOfTheDay}.jpg`
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.get('/api/images/:food', (req, res) => {
  try {
    const { food } = req.params;
    const foodPath = `./public/assets/images/${food}`;
    if (fs.existsSync(foodPath)) {
      const foodDB = fs.readdirSync(foodPath);
      const randomFood = Math.floor(Math.random() * foodDB.length + 1);
      res.status(200).send({ image: `https://foodish-api.herokuapp.com/images/${food}/${food}${randomFood}.jpg` });
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
