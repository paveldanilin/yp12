const cardsRouter = require('express').Router();
const fs = require('fs');
const path = require('path');

function getCardsData() {
  let filePath = path.resolve(`${__dirname }/../../data/cards.json`);
  if (process.env.NODE_ENV === 'production') {
    filePath = './data/cards.json';
  }
  return JSON.parse(fs.readFileSync(filePath));
}

const cardsList = (req, res) => {
  res.send(getCardsData());
};

cardsRouter.get('/cards', cardsList);

module.exports = cardsRouter;
