const mongoose = require('mongoose');


module.exports = async function initDB(url, auth) {
  return new Promise((resolve, reject) => {
    mongoose.set('useCreateIndex', true);
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // auth,
    }, (err) => {
      if (err) reject(err);
      resolve(mongoose.connection);
    });
  });
}
