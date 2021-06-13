import { Router } from 'express'
import { User } from '../models'
import { randomBytes } from 'crypto'
import { AuthenteValidations, ResisterValidation } from '../validators'
import {ValidateMiddleware,rolesValidate} from '../middleware/validate-middleware'
import sendMail from '../functions/send-email'
import { DOMAIN } from '../constant'
import { join } from 'path'
import {hash} from 'bcryptjs'
import passport from 'passport'
import {userAuth} from '../middleware/auth-guard'
const router = Router();

/**
 * @description To create new user account
 * @api /v1/api/user/register
 * @access Public
 * @author Ajay Sharma
 * @type POST
 */


router.post("/api/user/register", ResisterValidation, ValidateMiddleware, async (req, res) => {
    let { email, username, name,password } = req.body
    let user = await User.findOne({ username })
    if (user) {
        return res.json({
            success: false,
            message: "User Has already register"
        })
    }
    user = await User.findOne({ email })
    if (user) {
        return res.json({
            success: false,
            message: "Email Is already Register, if you forget password please reset password..!!"
        })
    }
    console.log(req.body)

    user = await new User({
        username,
        email,
        name,
        role:'user',
        password:await hash(password, 10),
         verificationCode: randomBytes(20).toString('hex')
    })
    await user.save()
    let html = `<div>
                <h3>Hi, ${user.username}</h3>
                <p>Your Account has been created for Bidding<p>
                <p>Please Verify Your Account on below link </p>
                <a href="${DOMAIN}/users/verify-now/${user.verificationCode}">Verify Now</a>
                </div>`
    // await sendMail(email, "Verify Account", "Hi This is First Notify", html)
    return res.status(201).json({
        success: true,
        message: "Account has been created..."
    })
})

/**
 * @description To create new Admin account
 * @api /v1/api/admin/register
 * @access Public
 * @author Ajay Sharma
 * @type POST
 */
router.post("/api/admin/register", ResisterValidation, ValidateMiddleware, async (req, res) => {
    let { email, username, name,password } = req.body
    let user = await User.findOne({ username })
    if (user) {
        return res.json({
            success: false,
            message: "User Has already register"
        })
    }
    user = await User.findOne({ email })
    if (user) {
        return res.json({
            success: false,
            message: "Email Is already Register, if you forget password please reset password..!!"
        })
    }
    console.log(req.body)

    user = await new User({
        username,
        email,
        name,
        role:'admin',
        password:await hash(password, 10),
         verificationCode: randomBytes(20).toString('hex')
    })
    await user.save()
    let html = `<div>
                <h3>Hi, ${user.username}</h3>
                <p>Your Account has been created for Bidding<p>
                <p>Please Verify Your Account on below link </p>
                <a href="${DOMAIN}/users/verify-now/${user.verificationCode}">Verify Now</a>
                </div>`
    // await sendMail(email, "Verify Account", "Hi This is First Notify", html)
    return res.status(201).json({
        success: true,
        message: "Account has been created ....!!s"
    })
})
/**
 * @description To create new Owner account
 * @api /v1/api/owner/register
 * @access Public
 * @author Ajay Sharma
 * @type POST
 */
 router.post("/api/owner/register", ResisterValidation, ValidateMiddleware, async (req, res) => {
    let { email, username, name,password } = req.body
    let user = await User.findOne({ username })
    if (user) {
        return res.json({
            success: false,
            message: "User Has already register"
        })
    }
    user = await User.findOne({ email })
    if (user) {
        return res.json({
            success: false,
            message: "Email Is already Register, if you forget password please reset password..!!"
        })
    }
    console.log(req.body)

    user = await new User({
        username,
        email,
        name,
        role:'owner',
        password:await hash(password, 10),
         verificationCode: randomBytes(20).toString('hex')
    })
    await user.save()
    let html = `<div>
                <h3>Hi, ${user.username}</h3>
                <p>Your Account has been created for Bidding<p>
                <p>Please Verify Your Account on below link </p>
                <a href="${DOMAIN}/users/verify-now/${user.verificationCode}">Verify Now</a>
                </div>`
    // await sendMail(email, "Verify Account", "Hi This is First Notify", html)
    return res.status(201).json({
        success: true,
        message: "Account has been created ....!!s"
    })
})

/**
 * @description To Remove Collection
 * @api /v1/api/user/remove
 * @author Ajay sharma
 * @access Public
 * @type GET
 * 
 */
router.post('/api/user/remove', async (req, res, next) => {
    await User.collection.deleteMany().then(response => {
        res.json({
            success: true,
            message: "Deleted Collections"
        })
    }).catch(err => {
        console.error(err)
    })
})
/**
 * @description To verify user by email
 * @api /v1/verify-now/:verificationCode
 * @author Ajay sharma
 * @access Public
 * @type GET
 * 
 */

// router.get('/verify-now/:verificationCode', async(req, res, next) => {
//     try {
//         const { verificationCode } = req.params
//         let user = await User.findOne(verificationCode)
//         if (!user) {
//             res.status(401).json({
//                 success: false,
//                 message: "Unauthrized user"
//             })
//         }
//         user.verified = true
//         user.verificationCode = undefined
//         user.save()
//         res.sendFile(join(__dirname, '../template/verify-account.html'))
//     } catch (err) {
//         res.sendFile(join(__dirname, '../template/error.html'))
//     }
// })

/**
 * @description To Login User
 * @api DOMAIN/v1/api/user-login
 * @author Ajay sharma
 * @access Public
 * @type POST
 * 
 */
router.post('/api/user-login',AuthenteValidations,ValidateMiddleware,async(req,res)=>{
    try{
        let {username,password} = req.body
        let user = await User.findOne({username})
        if(!user){
            return res.status(404).json({
                status:false,
                message:"User not Found"
            })
        }
        console.log(await user.comparePassword(password))
        if(!(await user.comparePassword(password))){
            return res.status(401).json({
                status:false,
                message:"Password  not Found"
            })
        }
        if(user.role !== 'user'){
            return res.json({
                status:false,
                message:"Please Make Sure You are right credentials.."
            })
        }
        let token = await user.generateJWT();
        return res.status(200).json({
            success:true,
            user:user.getUserInfo(),
            token: `Bearer ${token}`,
            message:"You are Logged in as user."
        })

    }catch(err){
        console.log(err)
    }
})


/**
 * @description To Login Admin
 * @api DOMAIN/v1/api/admin-login
 * @author Ajay sharma
 * @access Public
 * @type POST
 * 
 */
 router.post('/api/admin-login',AuthenteValidations,ValidateMiddleware,async(req,res)=>{
    try{
        let {username,password} = req.body
        let user = await User.findOne({username})
        if(!user){
            return res.status(404).json({
                status:false,
                message:"User not Found"
            })
        }
        console.log(await user.comparePassword(password))
        if(!(await user.comparePassword(password))){
            return res.status(401).json({
                status:false,
                message:"Password  not Found"
            })
        }
        if(user.role !== 'admin'){
            return res.json({
                status:false,
                message:"Please Make Sure You are right credentials.."
            })
        }
        let token = await user.generateJWT();
        return res.status(200).json({
            success:true,
            user:user.getUserInfo(),
            token: `Bearer ${token}`,
            message:"You are Logged in as Admin."
        })

    }catch(err){
        console.log(err)
    }
})

/**
 * @description To Login Owner
 * @api DOMAIN/v1/api/admin-login
 * @author Ajay sharma
 * @access Public
 * @type POST
 * 
 */
 router.post('/api/owner-login',AuthenteValidations,ValidateMiddleware,async(req,res)=>{
    try{
        let {username,password} = req.body
        let user = await User.findOne({username})
        if(!user){
            return res.status(404).json({
                status:false,
                message:"User not Found"
            })
        }
        console.log(await user.comparePassword(password))
        if(!(await user.comparePassword(password))){
            return res.status(401).json({
                status:false,
                message:"Password  not Found"
            })
        }
        if(user.role !== 'owner'){
            return res.json({
                status:false,
                message:"Please Make Sure You are right credentials.."
            })
        }
        let token = await user.generateJWT();
        return res.status(200).json({
            success:true,
            user:user.getUserInfo(),
            token: `Bearer ${token}`,
            message:"You are Logged in as Owner."
        })

    }catch(err){
        console.log(err)
    }
})

/**
 * @description To Profile Me by token
 * @api /api/profile 
 * @author Ajay sharma
 * @access Private
 * @type GET
 * 
 */

 router.get('/api/profile',userAuth, async(req,res)=>{
    return res.status(200).json({
        success:true,
        user:req.user
    })
})

/**
 * @description To Access For User
 * @api /api/user-access
 * @author Ajay sharma
 * @access Private
 * @type GET
 * 
 */

router.get('/api/user-access',userAuth,rolesValidate(['user','owner']), async(req,res)=>{
    return res.status(200).json({
        success:true,
        user:req.user
    })
})
/**
 * @description To Access For Admin
 * @api /api/admin-access
 * @author Ajay sharma
 * @access Private
 * @type GET
 * 
 */

 router.get('/api/admin-access',userAuth,rolesValidate(['admin','owner']), async(req,res)=>{
    return res.status(200).json({
        success:true,
        user:req.user
    })
})
/**
 * @description To Access For Owner
 * @api /api/owner-access
 * @author Ajay sharma
 * @access Private
 * @type GET
 * 
 */

 router.get('/api/owner-access',userAuth,rolesValidate(['owner']), async(req,res)=>{
    return res.status(200).json({
        success:true,
        user:req.user
    })
})
export default router