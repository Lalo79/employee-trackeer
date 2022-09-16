const express = require('express');
// Import and require mysql2
// const mysql = require('mysql2');

const { banner } = require('./script/questions');
const { functionManager } = require('./db/queries');
const { queryManager } = require('./script/queryFunctions');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
});



const init = async () => {

    console.log(banner);
    console.log('  --  WELCOME TO THE EMPLOYEE TRACKER  --  ');
    
    // await functionManager();
    await queryManager();

    console.log('\n\nNext process')
}

init();




