import passport from 'passport'
import {User} from '../models'
import {Strategy,ExtractJwt} from 'passport-jwt'
import {SECRET as secretOrKey} from '../constant'

const opt = {
    secretOrKey,
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
};
passport.use(
    new Strategy(opt,async({id},done)=>{
        try{
            let user = await User.findById(id)
            if(!user){
                throw new Error("User Not FOund")
            }
            return done(null,user.getUserInfo())
        }catch(err){
            console.log(err)

            return done(null,false)
        }
    })
)
