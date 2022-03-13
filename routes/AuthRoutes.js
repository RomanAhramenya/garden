const Router = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const OpenGround = require('../models/Openground');
const Bushes = require('../models/Bushes');
const Trees = require('../models/Trees');
const Greenhouse = require('../models/Greenhouse');
const Flowers = require('../models/Flowers');
const Microgreen = require('../models/Microgreen');
const fileMiddleware = require('./../middleware/upload');
const {check,validationResult,} = require('express-validator');

const router = Router();

function validation (message,req){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array(),
            message:message
        })
    }
}

router.post('/register',[
     check('email','некорректный email').isEmail(),
    check('password','минимальная длина пароля 6 символов').isLength({min:6})
    ],
    async(req,res)=>{
    try {
        validation('Не коректные данные при регестрации',req)

        const {email,password} = req.body;
        const candidate = await User.findOne({email});
        if(candidate){
            return res.status(400).json({message:'Такой пользователь уже существует'});
        }

        const hashPassword = await bcrypt.hash(password,7);
        const user = new User({email,password:hashPassword});
        await user.save();
        res.status(201).json({message:'Пользователь успешно создан'})
    } catch (error) {
        res.status(500).json({message:'что то пошло не так!'});
    }
})

router.post('/login',[
    check('email','некорректный email').isEmail(),
   check('password','Введите пароль').exists()
   ],
   async(req,res)=>{
   try {
    validation('Не коректные данные при Входе',req)
       const {email,password} = req.body;
       const user = await User.findOne({email});
       if(!user){
          return res.status(400).json({message:'Пользователь не найден'})
       };
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:'Неверный пароль'})
        }

        const token = jwt.sign({userId:user._id},config.get('jwtSecret'),{expiresIn:'1h'});

       res.json({token,userId:user.id})
   } catch (error) {
       res.status(500).json({message:'что то пошло не так!'});
   }
});
router.post('/upload',fileMiddleware.single('avatar'),async(req,res)=>{

    try {
        if(req.file) {
            res.json(req.file)
        }
    } catch (error) {
        console.log(error)
    }
})



function createRoutePost (path,Models) {
    return (
        router.post(path, async (req,res)=> {
            try {
                const {title,descript,image} = req.body
                const tit = await new Models({title,descript,image});
                tit.save()
                res.status(201).json({message:'ok'})
            } catch (error) {
                
            }
        })
        
    )
}

function createRouterGet (path,Models) {
    return (
        router.get(path, async (req,res)=>{
            try {
                const opengrounds = await Models.find();
                res.json(opengrounds)
            } catch (error) {
                
            }
        })
    )
}

function routerDelete (path,Models) {
    return (
        router.post(`/${path}/delete`, async (req,res)=>{
            try {
                const {id} = req.body
                const opengrounds = await Models.deleteOne({_id:id});
                res.status(201).json({message:'ok'})
            } catch (error) {
                res.status(400).json({message:'errror',error:error})
            }
        })
    )
}
createRoutePost('/openground' ,OpenGround);
createRouterGet('/openground',OpenGround);
routerDelete('openground',OpenGround);

createRoutePost('/bushes' ,Bushes);
createRouterGet('/bushes',Bushes);
routerDelete('bushes',Bushes);

createRoutePost('/trees' ,Trees);
createRouterGet('/trees',Trees);
routerDelete('trees',Trees);

createRoutePost('/greenhouse' ,Greenhouse);
createRouterGet('/greenhouse',Greenhouse);
routerDelete('greenhouse',Greenhouse);

createRoutePost('/flowers' ,Flowers);
createRouterGet('/flowers',Flowers);
routerDelete('flowers',Flowers);

createRoutePost('/microgreens' ,Microgreen);
createRouterGet('/microgreens',Microgreen);
routerDelete('microgreens',Microgreen);


module.exports = router