import Dexie from 'dexie'

export const db = new Dexie('kaogong')

db.version(1).stores({
  todos: '++id, date, category, subject, completed, createdAt',
  countdowns: '++id, targetDate, createdAt',
  study_records: '++id, date, category, subject, createdAt',
  exam_papers: '++id, date, type, createdAt',
  daily_practice: '++id, date, subject, createdAt',
  wrong_questions: '++id, date, subject, wrongReason, mastered, createdAt',
  essay_reviews: '++id, date, paperName, year, type, createdAt',
  calendar_events: '++id, date, category, createdAt'
})

db.version(2).stores({
  todos: '++id, date, category, subject, completed, status, createdAt',
  countdowns: '++id, targetDate, createdAt',
  study_records: '++id, date, category, subject, createdAt',
  exam_papers: '++id, date, type, createdAt',
  daily_practice: '++id, date, subject, createdAt',
  wrong_questions: '++id, date, subject, wrongReason, mastered, createdAt',
  essay_reviews: '++id, date, paperName, year, type, createdAt',
  calendar_events: '++id, date, category, createdAt'
}).upgrade(tx => {
  return tx.table('todos').toCollection().modify(todo => {
    if (!todo.status) todo.status = todo.completed ? '已结束' : '未开始'
    if (!todo.elapsedTime) todo.elapsedTime = 0
    if (!todo.actualCompletedAt) todo.actualCompletedAt = null
  })
})
