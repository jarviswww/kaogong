export const SUBJECTS = [
  { name: '数量关系', color: '#4A90D9' },
  { name: '资料分析', color: '#4CAF50' },
  { name: '判断推理', color: '#FF9800' },
  { name: '言语理解', color: '#9C27B0' },
  { name: '政治理论', color: '#F44336' },
  { name: '常识', color: '#FFC107' },
  { name: '申论', color: '#00BCD4' }
]

export function getSubjectColor(name) {
  const s = SUBJECTS.find(s => s.name === name)
  return s ? s.color : '#999999'
}
