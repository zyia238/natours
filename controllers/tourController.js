const fs = require('fs');
const { join } = require('path');

const tours = JSON.parse(
  fs.readFileSync(
    join(__dirname,'..', 'dev-data', 'data', 'tours-simple.json'),
    'utf-8'
  )
);
exports.getAllTours = (req, res) => {
  res.json({
    status: 200,
    data: {
      tours,
    },
  });
};

exports.createNewTour = (req, res) => {
  const tour = req.body;
  console.log(tour);
  const newTour = {
    id: tours.length,
    ...tour,
  };
  tours.push(newTour);
  fs.writeFile(
    join(__dirname, 'dev-data', 'data', 'tours-simple.json'),
    JSON.stringify(tours),
    (error) => {
      res.send('done');
    }
  );
};
