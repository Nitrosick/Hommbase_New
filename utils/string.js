export const resources = [
  'gold',
  'wood',
  'ore',
  'mercury',
  'sulfur',
  'crystal',
  'jewel'
]

const trade = [
  'gold',
  'cheap',
  'expensive'
]

export const firstUpper = (text) => {
	return text.charAt(0).toUpperCase() + text.substring(1)
}

export const makeCostString = (str) => {
  const array = JSON.parse(str)
  if (!Array.isArray(array)) return ''
  let result = ''

  if (array.length === resources.length) {
    for (let i = 0; i < array.length; i++) {
      if (array[i]) result += `${array[i]}<mark class="${resources[i]}"></mark>`
    }
    if (!result) return '-'
  } else if (array.length === trade.length) {
    const temp = []
    for (let i = 0; i < array.length; i++) {
      if (array[i]) temp.push(`${array[i]}<mark class="${trade[i]}"></mark>`)
    }
    if (!temp.length) return '-'
    result = temp.join('/ ')
  }

  return `<div class="cost-string">${result}</div>`
}
