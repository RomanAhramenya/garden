const {Schema,model} = require('mongoose');

const schema = new Schema({
    title:{type:String},
    descript:{type:String},
    image:{type:String}
})

module.exports = model('Microgreen',schema);