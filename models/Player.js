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


const refreeInfoSchema = new mongoose.Schema({
    name: String,
    password: String,
    refEmail: String,
    phone: String
});

const refreeInfo = mongoose.model('refreeInfo', refreeInfoSchema);

const playerInfo = mongoose.model('playerInfo', playerInfoSchema);

module.exports = {playerInfo, refreeInfo};