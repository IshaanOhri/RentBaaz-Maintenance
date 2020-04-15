import {Router} from 'express';
import {error, message} from '../config/errors';
import {User} from '../models/user';
import {Login} from '../models/login';
import {auth} from '../middleware/auth';
import { userInfo } from 'os';
const {compare, hash} = require('bcrypt');
const {sign} = require('jsonwebtoken')

const router = Router();

router.patch('/update', auth('*'), async(req:any, res:any)=>{
    const updates = Object.keys(req.body);
    const validUpdates:String[] = ['firstName','lastName','mobileNumber'];
    const isValidUpdate:boolean = updates.every((update:String)=>{
        return validUpdates.includes(update)
    });
    if(!isValidUpdate){
        return res.status(400).send({
            success : false,
            error : error.wrongParameters,
            message : message.wrongParameters
        });
    }
    try{
        const user = await User.findById(req.userId);
        updates.forEach((update)=>{
            user[update] = req.body[update];
        })
        await user.save();
        res.send({
            success : true
        });
    }catch(e){
        res.send(500).send();
    }
})

router.patch('/resetPassword', auth('*'), async(req:any, res:any)=>{
    try{
        if(!req.body.passwordOld || !req.body.passwordNew){
            res.status(400).send({
                success : false,
                error : error.invalidParameters,
                message : message.invalidParameters
            });
        }
        const user = await User.findById(req.userId);
        const check = await compare(req.body.passwordOld, user.password);
        if(!check){
            res.send({
                success : false,
                error : error.wrongPswd,
                message : message.wrongPswd
            });
        }
        user.password = await hash(req.body.passwordNew, 8);
        res.send({
            success : true,
        })
        await user.save();
    }catch(e){
        res.status(500).send(e);
    }
})


module.exports = router