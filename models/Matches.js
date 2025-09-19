const mongoose = require('mongoose');

const registerSinglesSchema = new mongoose.Schema({
    email: String,
    gender: String,
    isAllocated: Boolean
});


const registerDoublesSchema = new mongoose.Schema({
    teamName: String,
    email1: String,
    email2: String,
    gender: String,
    isAllocated: Boolean
});

const singlesBoysMatchesSchema = new mongoose.Schema({
    isBye: Boolean,
    email1: String,
    playerName1: String,
    playerName2: String,
    email2:String,
    matchNo: Number,
    refreeName: String,
    maxSetPoint: Number,
    maxSets : Number,
    round:String,
    status: String,
    set: Array,
    date: String,
    time: String,
    court: Number,
    winnerEmail: String,
    isComplete: Boolean,
    type: String
});

const singlesGirlsMatchesSchema = new mongoose.Schema({
    isBye: Boolean,
    email1: String,
    email2:String,
    playerName1: String,
    playerName2: String,
    matchNo: Number,
    refreeName: String,
    maxSetPoint: Number,
    maxSets : Number,
    round:String,
    status: String,
    set: Array,
    date: String,
    time: String,
    court: Number,
    winnerEmail: String,
    isComplete: Boolean,
    type: String
});

const doublesGirlsMatchesSchema = new mongoose.Schema({
    isBye: Boolean,
    teamName1 :String,
    teamNmae2: String,
    teamt1email1: String, 
    teamt1email2: String,
    teamt2email1: String,
    teamt2email2: String,
    matchNo: Number,
    refreeName: String,
    maxSetPoint: Number,
    maxSets : Number,
    round:String,
    status: String,
    set: Array,
    date: String,
    time: String,
    court: Number,
    winnerEmail: String,
    isComplete: Boolean,
    type: String
});

const doublesBoysMatchesSchema = new mongoose.Schema({
    isBye: Boolean,
    teamName1 :String,
    teamNmae2: String,
    teamt1email1: String, 
    teamt1email2: String,
    teamt2email1: String,
    teamt2email2: String,
    matchNo: Number,
    refreeName: String,
    maxSetPoint: Number,
    maxSets : Number,
    round:String,
    status: String,
    set: Array,
    date: String,
    time: String,
    court: Number,
    winnerEmail: String,
    isComplete: Boolean,
    type: String
});

const doublesBoysMatches = mongoose.model('doublesBoysMatches', doublesBoysMatchesSchema);
const doublesGirlsMatches = mongoose.model('doublesGirlsMatches', doublesGirlsMatchesSchema);
const singlesGirlsMatches = mongoose.model('singlesGirlsMatches', singlesGirlsMatchesSchema);
const singlesBoysMatches = mongoose.model('singlesBoysMatches', singlesBoysMatchesSchema);

const registerSingles = mongoose.model('registerSingles', registerSinglesSchema);
const registerDoubles = mongoose.model('registerDoubles', registerDoublesSchema);


module.exports = {
    registerSingles, 
    registerDoubles, 
    doublesBoysMatches, 
    doublesGirlsMatches, 
    singlesGirlsMatches, 
    singlesBoysMatches
};
