const form = document.querySelector('form')
const dataTable = document.getElementById('data-table')
const startInput = document.getElementById('start-date')
const endInput = document.getElementById('end-date')

const toISO = (d) => d.toISOString().slice(0, 10)

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const threeWeeksAgo = new Date()
threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21)

startInput.value = toISO(threeWeeksAgo)
endInput.value = toISO(yesterday)

for (const input of [startInput, endInput]) {
  input.min = '1940-01-01'
  input.max = toISO(yesterday)
}

// Oszlopok: sorrend és formázás egy helyen
const columns = [
  { key: 'date', format: (v) => v.split(' ')[0] },
  { key: 'tmin', format: (v) => Math.round(v) + ' °C' },
  { key: 'tmax', format: (v) => Math.round(v) + ' °C' },
  { key: 'prcp', format: (v) => v + ' mm' },
  { key: 'wspd', format: (v) => Math.round(v) + ' km/h' },
  { key: 'pres', format: (v) => Math.round(v) + ' hPa' },
]

form.addEventListener('submit', (e) => {
  e.preventDefault()
  loadData()
})
window.addEventListener('load', loadData)

async function loadData() {
  const start = startInput.value
  const end = endInput.value

  if (start > end) {
    showMessage('A kezdő dátum nem lehet később, mint a záró dátum.')
    return
  }

  const url = `https://meteostat.p.rapidapi.com/point/daily?lat=47.42&lon=19.07&start=${start}&end=${end}&alt=100`
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '6ff0fdc523mshefd17162e23cb33p1e0749jsn8b6419e96e95',
      'X-RapidAPI-Host': 'meteostat.p.rapidapi.com',
    },
  }

  try {
    const response = await fetch(url, options)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const result = await response.json()
    writeToTable(result.data ?? [])
  } catch (error) {
    console.error(error)
    showMessage('Nem sikerült lekérni az adatokat.')
  }
}

function writeToTable(rows) {
  dataTable.replaceChildren()
  rows.forEach((row) => {
    const tr = document.createElement('tr')
    columns.forEach(({ key, format }) => {
      const td = document.createElement('td')
      td.textContent = row[key] == null ? '–' : format(row[key])
      tr.appendChild(td)
    })
    dataTable.appendChild(tr)
  })
}

function showMessage(text) {
  dataTable.replaceChildren()
  const tr = document.createElement('tr')
  const td = document.createElement('td')
  td.colSpan = columns.length
  td.textContent = text
  tr.appendChild(td)
  dataTable.appendChild(tr)
}