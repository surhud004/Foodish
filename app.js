const express = require('express');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

var app = express();

app.use('/images', express.static(__dirname + '/public/assets/images'));
app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

const getImageCount = () => {
    let imageMetaData = [];
    let totalCount = 0;
    let menuDB = fs.readdirSync(`./public/assets/images`);
    menuDB.forEach((eachFoodDB) => {
        let foodDB = fs.readdirSync(`./public/assets/images/${eachFoodDB}`);
        totalCount += foodDB.length;
        imageMetaData.push({
            title: eachFoodDB,
            count: foodDB.length
        });
    });
    imageMetaData.push({
        title: 'Total Foodishes',
        count: totalCount
    });
    return imageMetaData;
};

// UI CALLS
app.get('/', (req, res) => {
    // menuDB is ['biryani', 'burger', 'pizza']
    let menuDB = fs.readdirSync(`./public/assets/images`);

    // random number generator within menuDB array range
    let randomSelector = Math.floor((Math.random() * menuDB.length));

    // anyRandomFood is burger
    let anyRandomFood = menuDB[randomSelector];

    // random number generator within all burger images
    let randomFoodDB = fs.readdirSync(`./public/assets/images/${anyRandomFood}`);

    // catchOfTheDay is burger101.jpg
    let catchOfTheDay = Math.floor((Math.random() * randomFoodDB.length) + 1);

    res.render('foodish' , { 
        food : {
            image : `${anyRandomFood}/${anyRandomFood}${catchOfTheDay}.jpg`,
            foodDB : getImageCount()
        } 
    });
});

app.get('/images/:food', (req, res) => {
    // food is pizza
    let food = req.params.food;
    
    // foodPath points to pizza directory 
    let foodPath = `./public/assets/images/${food}`;
    
    // check if pizza directory exists
    if (fs.existsSync(foodPath)) {

        // get all pizza images
        let foodDB = fs.readdirSync(foodPath);

        // randomly select one pizza image
        let randomFood = Math.floor((Math.random() * foodDB.length) + 1);

        res.render('foodish' , { food : {image : `${food}/${food}${randomFood}.jpg`} });
    } else {
        res.render('notfound', { food : {foodDB : getImageCount()}});
    }
});




// API CALLS
app.get('/api', (req, res) => {
    try {
        let menuDB = fs.readdirSync(`./public/assets/images`);
        let randomSelector = Math.floor((Math.random() * menuDB.length));
        let anyRandomFood = menuDB[randomSelector];
        let randomFoodDB = fs.readdirSync(`./public/assets/images/${anyRandomFood}`);
        let catchOfTheDay = Math.floor((Math.random() * randomFoodDB.length) + 1);
        res.status(200).send({ 'image' : `https://foodish.herokuapp.com/images/${anyRandomFood}/${anyRandomFood}${catchOfTheDay}.jpg`});
    } catch (error) {
        res.status(500).send({ 'error' : error});    
    }
});

app.get('/api/images/:food', (req, res) => {
    try {
        let food = req.params.food;
        let foodPath = `./public/assets/images/${food}`;
        if (fs.existsSync(foodPath)) {
            let foodDB = fs.readdirSync(foodPath);
            let randomFood = Math.floor((Math.random() * foodDB.length) + 1);
            res.status(200).send({ 'image' : `https://foodish.herokuapp.com/images/${food}/${food}${randomFood}.jpg`});
        } else {
            res.status(404).send({ 'error' : 'Not found.'});
        }   
    } catch (error) {
        res.status(500).send({ 'error' : error});
    }
});

app.get('*', (req, res) => {
    res.status(404).send({ 'error' : 'Not found.'});
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});