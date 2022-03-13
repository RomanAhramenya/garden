const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path')

const app = express();
app.use(express.json({ extended: true }))
app.use('/api/auth',require('./routes/AuthRoutes.js'));
app.use('/images',express.static(path.join(__dirname,'images')))
const PORT = config.get('port') || 5000;
async function start(){
    try{
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
           
        });
        app.listen(PORT, () => console.log(`Сервер работает порте ${PORT}`));
    }catch(e){
        console.log('Error',e);
    }
}

start();