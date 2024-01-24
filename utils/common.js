const resources = [
  'gold',
  'wood',
  'ore',
  'mercury',
  'sulfur',
  'crystal',
  'jewel'
]

export const firstUpper = (text) => {
	return text.charAt(0).toUpperCase() + text.substring(1)
}

export const makeCostString = (str) => {
  const array = JSON.parse(str)
  if (!Array.isArray(array) || array.length !== resources.length) return ''
  let result = ''
  for (let i = 0; i < array.length; i++) {
    if (array[i]) result += `${array[i]}<mark class="${resources[i]}"></mark>`
  }
  if (!result) return '-'
  return `<div class="cost-string">${result}</div>`
}
