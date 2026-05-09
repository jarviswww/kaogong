import { db } from '../db/index.js'

const BACKUP_VERSION = 1
const TABLE_NAMES = ['todos', 'countdowns', 'study_records', 'exam_papers', 'daily_practice', 'wrong_questions', 'essay_reviews', 'calendar_events']

export async function exportAll() {
  const data = { version: BACKUP_VERSION, exportedAt: new Date().toISOString(), tables: {} }
  for (const name of TABLE_NAMES) {
    data.tables[name] = await db[name].toArray()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kaogong-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportTable(tableName) {
  const data = { version: BACKUP_VERSION, exportedAt: new Date().toISOString(), tables: { [tableName]: await db[tableName].toArray() } }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kaogong-${tableName}-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importData(file) {
  const text = await file.text()
  const data = JSON.parse(text)
  if (!data.version || !data.tables) throw new Error('无效的备份文件格式')
  for (const [name, rows] of Object.entries(data.tables)) {
    if (TABLE_NAMES.includes(name)) {
      await db[name].clear()
      await db[name].bulkAdd(rows.map(r => { const { id, ...rest } = r; return rest }))
    }
  }
}
