const mongoose = require('mongoose');

const playerInfoSchema = new mongoose.Schema({
    name: String,
    gender: String,
    password: String,
    phone: String,
    email: String,
    prn: String,
    year: String,
    branch: String,
    doubles: Boolean,
    singles: Boolean
});

const playerInfo = mongoose.model('playerInfo', playerInfoSchema);

module.exports = {playerInfo};