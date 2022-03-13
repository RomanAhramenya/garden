const {Schema,model} = require('mongoose');

const open = new Schema({
    title:{type:String},
    descript:{type:String},
    image:{type:String}
})

module.exports = model('Openground',open);