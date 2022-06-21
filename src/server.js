const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');


// Prepare the express app
const app = express();

// Process JSON input and put the data on req.body
app.use(express.json());


const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? 'sqlite::memory'
  : process.env.DATABASE_URL || 'sqlite:memory'; 

const sequelize = new Sequelize(DATABASE_URL);

const PORT = process.env.PORT || 3002;


// Process FORM input and put the data on req.body
app.use(express.urlencoded({ extended: true }));

// Create a Sequelize model
const UsersModel  = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});


// can attach a method to UserModel
UsersModel.beforeCreate = (user) =>{
  console.log(user);
}

app.post('/signin', async (req, res) => {

  /*
    req.headers.authorization is : "Basic sdkjdsljd="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */

  let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
  let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(':'); // username, password

  /*
    Now that we finally have username and password, let's see if it's valid
    1. Find the user in the database by username
    2. Compare the plaintext password we now have against the encrypted password in the db
       - bcrypt does this by re-encrypting the plaintext password and comparing THAT
    3. Either we're valid or we throw an error
  */
  try {
    const user = await Users.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      res.status(200).json(user);
    }
    else {
      throw new Error('Invalid User');
    }
  } catch (error) { res.status(403).send('Invalid Login'); }

});

async function basicAuth(req,res,next){
  let { authorization } = req.headers;

  console.log(authorization);
  if(!authorization){
    res.status(401).send('not Authorized');
  }else{
    // get rid of basic
    let authStr = authorization.split(' ')[1];

    console.log('authStr:', authStr);

    let decodedAuthStr  = base64.decode(authStr)
    console.log('decodedAuthStr:', decodedAuthStr); //tester:pass123

  }
  
  let [ username, password ] = decodedAuthStr.split(':');
  console.log('username:', username);
  console.log('password:', password);

  let user = await UsersModel.findOne({where: {username}});

  if (user){
    let validUser = await bcrypt.compare(password, user.password);
    if (validUser){
      // previously req.user did not exist.  
      // if user is authenticated, let add it
      req.user = user
      next()
    } else {
      next('Not Authorized');
    }
  }
}

app.post('/signup', async (req, res) => {

  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const record = await Users.create(req.body);
    res.status(200).json(record);
  } catch (e) { res.status(403).send('Error Creating User'); }
});

app.get('/hello', basicAuth, (req, res, next) => {
  let { name } = req.query;
  console.log('auth proof', req.user.username)
  res.status(200).send(`Greetings ${name}! this route is now secured by Basic AUth!!!`)
})

module.exports = {
  server: app,
  start: () => app.listen(PORT, console.log('server running on', PORT)),
  sequelize
}