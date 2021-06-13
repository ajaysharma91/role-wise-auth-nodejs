import {config} from "dotenv"
config()

export const PORT = process.env.PORT || process.env.APP_PORT
export const DB = process.env.APP_DB
export const SECRET = process.env.APP_SECRET
export const DOMAIN = process.env.APP_DOMAIN
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY