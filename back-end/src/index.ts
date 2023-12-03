import Application from './application'
import dotenv from 'dotenv'

dotenv.config()

const application = new Application()

application.startServer()
