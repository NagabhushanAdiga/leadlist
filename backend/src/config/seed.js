import { Admin } from '../models/schemas/Admin.js'
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
