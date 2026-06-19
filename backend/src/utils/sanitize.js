export function toPlain(doc) {
  if (!doc) return null
  return typeof doc.toObject === 'function' ? doc.toObject() : doc
}

export function withoutPassword(record) {
  const plain = toPlain(record)
  const { password, ...safeRecord } = plain
  return safeRecord
}

export function toPublicUser(user) {
  return {
    ...withoutPassword(user),
    enabled: user.enabled === true,
  }
}

export function formatTimestamps(record) {
  const plain = toPlain(record)
  return {
    ...plain,
    createdAt: plain.createdAt?.toISOString?.() || plain.createdAt,
    updatedAt: plain.updatedAt?.toISOString?.() || plain.updatedAt,
  }
}
