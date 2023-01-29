const mongoose = require('mongoose')

mongoose.set("strictQuery", false);

mongoose.connect(process.env.mongodbURL).then(() => {
    console.log("Connection Successful");
})
  .catch((err) => {
    console.log("Connection Failed");
    console.log(err.message);
});
