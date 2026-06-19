import { Admin } from '../models/schemas/Admin.js'
import { User } from '../models/schemas/User.js'
import { DEFAULT_ADMIN } from '../config/index.js'

export async function seedDefaultAdmin() {
  const count = await Admin.countDocuments()

  if (count > 0) {
    return
  }

  await Admin.create({
    name: DEFAULT_ADMIN.name,
    email: DEFAULT_ADMIN.email,
    password: DEFAULT_ADMIN.password,
    isPrimary: true,
  })

  console.log(`Default admin created: ${DEFAULT_ADMIN.email}`)
}

export async function seedDefaultUser() {
  const count = await User.countDocuments()

  if (count > 0) {
    return
  }

  await User.create({
    name: 'Demo User',
    email: 'demo@test.com',
    password: 'pass123',
    mobile: '1234567890',
    role: 'Sales Executive',
    enabled: true,
  })

  console.log('Default demo user created: demo@test.com')
}
