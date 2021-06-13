import { validationResult } from 'express-validator'

export const ValidateMiddleware = (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.json({
            errors: errors.array()
        })
    }
    next()

}

export const rolesValidate = roles => (req,res,next)=> !roles.includes(req.user.role)?res.status(401).json({message:'Unauthoriazed',success:false}):next()

