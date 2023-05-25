const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb+srv://admin:admin@mern-learnit.xoudesc.mongodb.net/blog');
        console.log('Connect Successfully!');
    } catch (error) {
        console.log('Fail!');
    }

};

module.exports = { connect };






