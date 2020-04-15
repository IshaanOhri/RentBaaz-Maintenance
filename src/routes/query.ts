import {Router} from 'express';
import {error, message} from '../config/errors';
import {User} from '../models/user';
import {auth} from '../middleware/auth';
import {Query} from '../models/query';

const router = Router();

router.post('/addQuery', auth('*'), async(req, res)=>{
    
})

module.exports = router;