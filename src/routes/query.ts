import {Router} from 'express';
import {error, message} from '../config/errors';
import {User} from '../models/user';
import {auth} from '../middleware/auth';
import {Query} from '../models/query';

const router = Router();

router.post('/addQuery', auth('*'), async(req, res)=>{
    if(!req.body.productName || !req.body.description){
        return res.send({
            success : true,
            error : error.invalidParameters,
            message : message.invalidParameters
        });
    }
    try{
        const query = new Query({
            ...req.body,
            owner : req.userId
        });
        res.send({
            success : true,
        });
        await query.save();
    }catch(e){
        res.status(500).send(e);
    }
})

router.delete('/deleteQuery/:id', auth('*'), async(req, res)=>{
    try{
        const query = await Query.findOneAndDelete({_id : req.params.id, owner : req.userId});
        if(!query){
            return res.status(400).send({
                success : false,
                error : error.notFound,
                message : message.notFound
            });
        }
        res.send({
            success : true
        });
    }catch(e){
        res.status(500).send(e);
    }
})

router.patch('/updateQuery/:id', auth('*'), async(req, res)=>{
    const updates = Object.keys(req.body);
    const validUpdates = ['productName','description'];
    const isValid = updates.every((update)=>{
        return validUpdates.includes(update);
    });

    if(!isValid){
        return res.status(400).send({
            success : false,
            error : error.wrongParameters,
            message : message.wrongParameters
        });
    }

    try{
        const query = await Query.findOne({_id : req.params.id, owner : req.userId});
        if(!query){
            return res.status(400).send({
                success : false,
                error : error.notFound,
                message : message.notFound
            });
        }
        updates.forEach((update)=>{
            query[update] = req.body[update];
        })
        await query.save();
        res.send({
            success : true
        });
    }catch(e){
        res.status(500).send(e);
    }
})

module.exports = router;