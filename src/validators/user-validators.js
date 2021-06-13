import {check} from 'express-validator'

const name = check('name',"Name is Required").not().isEmpty()
const username = check('username',"UserName is Required").not().isEmpty()
const email = check('email',"Email provide a valid email ").isEmail()
const password = check('password',"Password is Required of minimum length 6").isLength({
    min:6
})

export const ResisterValidation = [password,name,username,email]
export const AuthenteValidations = [username,password]