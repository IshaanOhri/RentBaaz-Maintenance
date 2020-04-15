const {v4,v1} = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const t = v4()
// console.log(typeof(t))
console.log(t)

const timestamp = Date.now()
expiry = timestamp + (3 * 24 * 60 * 60 * 100)
//console.log(timestamp)
console.log(typeof(expiry))


// const pswd = async()=>{
//     const p = await bcrypt.hash('akshit',8).then()
//     console.log(p)
// }

// pswd()

console.log(v1())

const token = jwt.sign({id : 'asd',age : 19},'akshit')
const v = jwt.verify(token, 'akshit')
const d = jwt.decode(token)
console.log(d)

const auth = (group)=>{
    if(!group){
        console.log('if')
    }
    console.log(group)
}

auth('user')