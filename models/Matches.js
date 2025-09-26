const mongoose = require('mongoose');

const registerSinglesSchema = new mongoose.Schema({
    email: String,
    gender: String,
    isAllocated: Boolean,
    round:String
});


const registerDoublesSchema = new mongoose.Schema({
    teamName: String,
    email1: String,
    email2: String,
    gender: String,
    isAllocated: Boolean,
    round:String
});

const singlesBoysMatchesSchema = new mongoose.Schema({
    isBye: Boolean,
    email1: String,
    playerName1: String,
    playerName2: String,
    email2:String,
    matchNo: String,
    refreeName: String,
    refEmail: String,
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
    matchType: String,
    nextRound:String
});

const singlesGirlsMatchesSchema = new mongoose.Schema({
    isBye: Boolean,
    email1: String,
    email2:String,
    playerName1: String,
    playerName2: String,
    matchNo: String,
    refreeName: String,
    refEmail: String,
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
    matchType: String,
    nextRound:String
});

const doublesGirlsMatchesSchema = new mongoose.Schema({
    isBye: Boolean,
    teamName1 :String,
    teamName2: String,
    teamt1email1: String, 
    teamt1email2: String,
    teamt2email1: String,
    teamt2email2: String,
    matchNo: String,
    refreeName: String,
    refEmail: String,
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
    matchType: String,
    nextRound:String
});

const doublesBoysMatchesSchema = new mongoose.Schema({
    isBye: Boolean,
    teamName1 :String,
    teamName2: String,
    teamt1email1: String, 
    teamt1email2: String,
    teamt2email1: String,
    teamt2email2: String,
    matchNo: String,
    refreeName: String,
    refEmail: String,
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
    matchType: String,
    nextRound:String

});


const singleBoysRoundsSchema = new mongoose.Schema({
    id:String,
    round1:Array,
    round2: Array,
    round3:Array,
    round4:Array,
    quaterFinale: Array,
    semiFinale: Array,
    finale: Array
});

const singleGirlsRoundsSchema = new mongoose.Schema({
    id:String,
    round1:Array,
    round2: Array,
    quaterFinale: Array,
    semiFinale: Array,
    finale: Array
});


const doublesBoysRoundsSchema = new mongoose.Schema({
    id:String,
    round1:Array,
    round2: Array,
    round3: Array,
    quaterFinale: Array,
    semiFinale: Array,
    finale: Array
});


const doublesGirlsRoundsSchema = new mongoose.Schema({
    id:String,
    round1:Array,
    quaterFinale: Array,
    semiFinale: Array,
    finale: Array
});


const matchCounterSchema = new mongoose.Schema({
    id: String,
    singlesBoysMatchesCount: Number,
    singlesGirlsMatchesCount: Number,
    doublesBoysMatchesCount: Number,
    doublesGirlsMatchesCount: Number
});

const doublesBoysMatches = mongoose.model('doublesBoysMatches', doublesBoysMatchesSchema);
const doublesGirlsMatches = mongoose.model('doublesGirlsMatches', doublesGirlsMatchesSchema);
const singlesGirlsMatches = mongoose.model('singlesGirlsMatches', singlesGirlsMatchesSchema);
const singlesBoysMatches = mongoose.model('singlesBoysMatches', singlesBoysMatchesSchema);

const registerSingles = mongoose.model('registerSingles', registerSinglesSchema);
const registerDoubles = mongoose.model('registerDoubles', registerDoublesSchema);

const matchCounter = mongoose.model('matchCounter', matchCounterSchema);


const singleBoysRounds = mongoose.model('singleBoysRounds', singleBoysRoundsSchema);
const singleGirlsRounds = mongoose.model('singleGirlsRounds', singleGirlsRoundsSchema);
const doublesBoysRounds = mongoose.model('doublesBoysRounds', doublesBoysRoundsSchema);
const doublesGirlsRounds = mongoose.model('doublesGirlsRounds', doublesGirlsRoundsSchema);


module.exports = {
    registerSingles, 
    registerDoubles, 
    doublesBoysMatches, 
    doublesGirlsMatches, 
    singlesGirlsMatches, 
    singlesBoysMatches,
    matchCounter,
    singleBoysRounds,
    singleGirlsRounds,
    doublesBoysRounds,
    doublesGirlsRounds
};
