import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.join(__dirname, '../../.env') })

export const PORT = process.env.PORT || 4000
export const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leadlist'

export const DEFAULT_ADMIN = {
  name: 'Primary Admin',
  email: process.env.ADMIN_EMAIL || 'admin@leadlist.com',
  password: process.env.ADMIN_PASSWORD || 'admin123',
}
