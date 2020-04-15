const {verify} = require('jsonwebtoken');
import {User} from '../models/user';
import {error, message} from '../config/errors';

export const auth = (group : String) => {
    return async(req: any, res: any, next: any)=>{
        try{
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = verify(token, process.env.SECRET_KEY);
    
            if(group === 'admin'){
                if(decoded.group !== 'admin'){
                    throw new Error();
                }
            }
    
            const user = await User.findOne({_id : decoded._id});
            
            if(!user){
                throw new Error();
            }
    
            req.userId = user._id;
            next();
        }catch(e){
            res.status(401).send({
                error : error.Unauthorized,
                message : message.Unauthorized
            });
        }
    }
}



