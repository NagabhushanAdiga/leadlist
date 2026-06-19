import cors from 'cors'
import express from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import * as XLSX from 'xlsx'
import { parseLeadsFromWorksheet } from './utils/excelImport.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'data', 'db.json')
const PORT = process.env.PORT || 4000

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors())
app.use(express.json())

function readDb() {
  const raw = fs.readFileSync(DB_PATH, 'utf8')
  const db = JSON.parse(raw)

  if (!db.sessions) db.sessions = {}
  if (!db.admins) db.admins = []

  if (db.admins.length === 0 && db.admin) {
    db.admins.push({
      id: uuidv4(),
      name: 'Primary Admin',
      email: db.admin.email,
      password: db.admin.password,
      isPrimary: true,
      createdAt: new Date().toISOString(),
    })
    writeDb(db)
  }

  return db
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

function withoutPassword(user) {
  const { password, ...safeUser } = user
  return safeUser
}

function createSession(db, { type, userId, adminId }) {
  const token = `${type}-token-${uuidv4()}`
  db.sessions[token] = {
    type,
    userId: userId || null,
    adminId: adminId || null,
    createdAt: new Date().toISOString(),
  }
  return token
}

function getSession(db, token) {
  if (!token) return null
  return db.sessions[token] || null
}

function findUserById(db, userId) {
  return db.users.find((user) => user.id === userId)
}

function findAdminByCredentials(db, email, password) {
  return db.admins.find(
    (admin) =>
      admin.email.toLowerCase() === email.trim().toLowerCase() && admin.password === password,
  )
}

function enrichLead(db, lead) {
  const owner = findUserById(db, lead.userId)
  return {
    ...lead,
    userName: owner?.name || 'Unknown user',
    userEmail: owner?.email || '',
  }
}

function importLeadsForUser(db, userId, parsedLeads) {
  db.leads = db.leads.filter((lead) => lead.userId !== userId)

  const importedLeads = parsedLeads.map((lead) => ({
    id: uuidv4(),
    userId,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    role: lead.role,
    status: lead.status,
    followUpDate: lead.followUpDate || null,
    rejectionReason: lead.rejectionReason || null,
    createdAt: new Date().toISOString(),
  }))

  db.leads.push(...importedLeads)
  return importedLeads
}

function parseExcelBuffer(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]

  if (!sheetName) {
    throw new Error('No worksheet found in the Excel file.')
  }

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    header: 1,
    defval: '',
    blankrows: false,
  })

  return parseLeadsFromWorksheet(rows)
}

function adminAuthMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  const db = readDb()
  const session = getSession(db, token)

  if (!session || session.type !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.adminId = session.adminId
  next()
}

function userAuthMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  const db = readDb()
  const session = getSession(db, token)

  if (!session || session.type !== 'user' || !session.userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const user = findUserById(db, session.userId)

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (user.enabled !== true) {
    return res.status(403).json({ message: 'Account is not active. Contact your admin.' })
  }

  req.userId = user.id
  req.user = user
  next()
}

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const db = readDb()
  const admin = findAdminByCredentials(db, email, password)

  if (!admin) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const token = createSession(db, { type: 'admin', adminId: admin.id })
  writeDb(db)

  res.json({
    token,
    admin: withoutPassword(admin),
  })
})

app.post('/api/auth/user-login', (req, res) => {
  const { email, password } = req.body

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const db = readDb()
  const user = db.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const token = createSession(db, { type: 'user', userId: user.id })
  writeDb(db)

  res.json({
    token,
    user: {
      ...withoutPassword(user),
      enabled: user.enabled === true,
    },
  })
})

app.post('/api/auth/user-register', (req, res) => {
  const { name, email, password } = req.body

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Name, email, and password are required.' })
  }

  if (password.trim().length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  }

  const db = readDb()
  const exists = db.users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase())

  if (exists) {
    return res.status(400).json({ message: 'A user with this email already exists.' })
  }

  const user = {
    id: uuidv4(),
    name: name.trim(),
    email: email.trim(),
    password: password.trim(),
    mobile: '',
    role: 'Sales Executive',
    company: '',
    enabled: false,
    createdAt: new Date().toISOString(),
  }

  db.users.push(user)
  const token = createSession(db, { type: 'user', userId: user.id })
  writeDb(db)

  res.status(201).json({
    token,
    user: {
      ...withoutPassword(user),
      enabled: false,
    },
  })
})

app.get('/api/stats', adminAuthMiddleware, (req, res) => {
  const db = readDb()
  const statusCounts = db.leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1
    return acc
  }, {})

  res.json({
    totalUsers: db.users.length,
    totalLeads: db.leads.length,
    statusCounts,
  })
})

app.get('/api/users', adminAuthMiddleware, (req, res) => {
  const db = readDb()
  res.json(
    db.users.map((user) => ({
      ...withoutPassword(user),
      enabled: user.enabled === true,
    })),
  )
})

app.post('/api/users', adminAuthMiddleware, (req, res) => {
  const { name, email, password, mobile, role, company } = req.body

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Name, email, and password are required.' })
  }

  const db = readDb()
  const exists = db.users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase())

  if (exists) {
    return res.status(400).json({ message: 'A user with this email already exists.' })
  }

  const user = {
    id: uuidv4(),
    name: name.trim(),
    email: email.trim(),
    password: password.trim(),
    mobile: mobile?.trim() || '',
    role: role?.trim() || 'Sales Executive',
    company: company?.trim() || '',
    enabled: req.body.enabled === true,
    createdAt: new Date().toISOString(),
  }

  db.users.push(user)
  writeDb(db)

  res.status(201).json({
    ...withoutPassword(user),
    enabled: user.enabled === true,
  })
})

app.put('/api/users/:id', adminAuthMiddleware, (req, res) => {
  const db = readDb()
  const index = db.users.findIndex((user) => user.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({ message: 'User not found.' })
  }

  const current = db.users[index]
  const { name, email, password, mobile, role, company, enabled } = req.body

  db.users[index] = {
    ...current,
    name: name?.trim() || current.name,
    email: email?.trim() || current.email,
    password: password?.trim() || current.password,
    mobile: mobile?.trim() ?? current.mobile,
    role: role?.trim() ?? current.role,
    company: company?.trim() ?? current.company,
    enabled: typeof enabled === 'boolean' ? enabled : current.enabled === true,
    updatedAt: new Date().toISOString(),
  }

  writeDb(db)

  res.json({
    ...withoutPassword(db.users[index]),
    enabled: db.users[index].enabled === true,
  })
})

app.delete('/api/users/:id', adminAuthMiddleware, (req, res) => {
  const db = readDb()
  const userId = req.params.id
  const nextUsers = db.users.filter((user) => user.id !== userId)

  if (nextUsers.length === db.users.length) {
    return res.status(404).json({ message: 'User not found.' })
  }

  db.users = nextUsers
  db.leads = db.leads.filter((lead) => lead.userId !== userId)
  writeDb(db)
  res.json({ success: true })
})

app.get('/api/leads', adminAuthMiddleware, (req, res) => {
  const db = readDb()
  const { userId } = req.query

  let leads = db.leads

  if (userId) {
    leads = leads.filter((lead) => lead.userId === userId)
  }

  res.json(leads.map((lead) => enrichLead(db, lead)))
})

app.put('/api/leads/:id', adminAuthMiddleware, (req, res) => {
  const db = readDb()
  const index = db.leads.findIndex((lead) => lead.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({ message: 'Lead not found.' })
  }

  const { status, followUpDate, rejectionReason, name, email, phone, company, role } = req.body
  const current = db.leads[index]

  db.leads[index] = {
    ...current,
    name: name?.trim() ?? current.name,
    email: email?.trim() ?? current.email,
    phone: phone?.trim() ?? current.phone,
    company: company?.trim() ?? current.company,
    role: role?.trim() ?? current.role,
    status: status ?? current.status,
    followUpDate: followUpDate ?? current.followUpDate,
    rejectionReason: rejectionReason ?? current.rejectionReason,
    updatedAt: new Date().toISOString(),
  }

  writeDb(db)
  res.json(enrichLead(db, db.leads[index]))
})

app.delete('/api/leads/:id', adminAuthMiddleware, (req, res) => {
  const db = readDb()
  const nextLeads = db.leads.filter((lead) => lead.id !== req.params.id)

  if (nextLeads.length === db.leads.length) {
    return res.status(404).json({ message: 'Lead not found.' })
  }

  db.leads = nextLeads
  writeDb(db)
  res.json({ success: true })
})

app.post('/api/leads/import', adminAuthMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Excel file is required.' })
  }

  const userId = req.body.userId?.trim()

  if (!userId) {
    return res.status(400).json({ message: 'Select a user to import leads for.' })
  }

  try {
    const db = readDb()
    const user = findUserById(db, userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const parsedLeads = parseExcelBuffer(req.file.buffer)
    const importedLeads = importLeadsForUser(db, userId, parsedLeads)
    writeDb(db)

    res.json({
      count: importedLeads.length,
      userId,
      userName: user.name,
      leads: importedLeads.map((lead) => enrichLead(db, lead)),
    })
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to import Excel file.' })
  }
})

app.get('/api/my/leads', userAuthMiddleware, (req, res) => {
  const db = readDb()
  const leads = db.leads.filter((lead) => lead.userId === req.userId)
  res.json(leads)
})

app.put('/api/my/leads/:id', userAuthMiddleware, (req, res) => {
  const db = readDb()
  const index = db.leads.findIndex((lead) => lead.id === req.params.id && lead.userId === req.userId)

  if (index === -1) {
    return res.status(404).json({ message: 'Lead not found.' })
  }

  const { status, followUpDate, rejectionReason } = req.body
  const current = db.leads[index]

  db.leads[index] = {
    ...current,
    status: status ?? current.status,
    followUpDate: followUpDate ?? current.followUpDate,
    rejectionReason: rejectionReason ?? current.rejectionReason,
    updatedAt: new Date().toISOString(),
  }

  writeDb(db)
  res.json(db.leads[index])
})

app.post('/api/my/leads/import', userAuthMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Excel file is required.' })
  }

  try {
    const db = readDb()
    const parsedLeads = parseExcelBuffer(req.file.buffer)
    const importedLeads = importLeadsForUser(db, req.userId, parsedLeads)
    writeDb(db)

    res.json({
      count: importedLeads.length,
      leads: importedLeads,
    })
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to import Excel file.' })
  }
})

app.get('/api/admins', adminAuthMiddleware, (req, res) => {
  const db = readDb()
  res.json(db.admins.map((admin) => withoutPassword(admin)))
})

app.post('/api/admins', adminAuthMiddleware, (req, res) => {
  const { name, email, password } = req.body

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Name, email, and password are required.' })
  }

  if (password.trim().length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  }

  const db = readDb()
  const exists = db.admins.some((admin) => admin.email.toLowerCase() === email.trim().toLowerCase())

  if (exists) {
    return res.status(400).json({ message: 'An admin with this email already exists.' })
  }

  const admin = {
    id: uuidv4(),
    name: name.trim(),
    email: email.trim(),
    password: password.trim(),
    isPrimary: false,
    createdAt: new Date().toISOString(),
  }

  db.admins.push(admin)
  writeDb(db)

  res.status(201).json(withoutPassword(admin))
})

app.delete('/api/admins/:id', adminAuthMiddleware, (req, res) => {
  const db = readDb()
  const admin = db.admins.find((item) => item.id === req.params.id)

  if (!admin) {
    return res.status(404).json({ message: 'Admin not found.' })
  }

  if (admin.isPrimary) {
    return res.status(400).json({ message: 'The primary admin account cannot be deleted.' })
  }

  db.admins = db.admins.filter((item) => item.id !== req.params.id)
  writeDb(db)
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
