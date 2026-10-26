const submit = document.getElementById('submit')
const data = document.getElementById('data')
const dataTable = document.getElementById('data-table')
const today = new Date()
today.setDate(today.getDate() - 1)
const threeWeeksAgo = new Date()
threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21)
document.getElementById('start-date').valueAsDate = threeWeeksAgo
document.getElementById('end-date').valueAsDate = today

document.getElementById('start-date').min = '1940-01-01'
document.getElementById('start-date').max =
  today.getUTCFullYear() +
  '-' +
  ('0' + (today.getUTCMonth() + 1)).slice(-2) +
  '-' +
  ('0' + today.getUTCDate()).slice(-2)
document.getElementById('end-date').min = '1940-01-01'
document.getElementById('end-date').max =
  today.getUTCFullYear() +
  '-' +
  ('0' + (today.getUTCMonth() + 1)).slice(-2) +
  '-' +
  ('0' + today.getUTCDate()).slice(-2)
window.addEventListener('load', getDate)
submit.addEventListener('click', getDate)

function getDate() {
  const startDate = document.getElementById('start-date').value
  const endDate = document.getElementById('end-date').value
  const url = `https://meteostat.p.rapidapi.com/point/daily?lat=47.42&lon=19.07&start=${startDate}&end=${endDate}&alt=100`
  //const url = 'ms-2022.json'
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '6ff0fdc523mshefd17162e23cb33p1e0749jsn8b6419e96e95',
      'X-RapidAPI-Host': 'meteostat.p.rapidapi.com',
    },
  }
  getData(url, options)
}

async function getData(url, options) {
  try {
    const response = await fetch(url, options)
    const result = await response.json()
    deleteFromTable()
    writeToTable(result.data)
  } catch (error) {
    console.error(error)
  }
}

function writeToTable(arr) {
  arr.forEach(function (obj) {
    let tr = document.createElement('tr')
    dataTable.appendChild(tr)
    Object.keys(obj).forEach(function (key) {
      let td = document.createElement('td')
      switch (key) {
        case 'date':
          tr.appendChild(td)
          td.innerHTML = obj[key].split(' ')[0]
          break
        case 'tmax':
          tr.appendChild(td)
          td.innerHTML = Math.round(obj[key]) + ' C°'
          break
        case 'tmin':
          tr.appendChild(td)
          td.innerHTML = Math.round(obj[key]) + ' C°'
          break
        case 'prcp':
          tr.appendChild(td)
          td.innerHTML = obj[key] + ' mm'
          break
        case 'wspd':
          tr.appendChild(td)
          td.innerHTML = Math.round(obj[key]) + ' km/h'
          break
        case 'pres':
          tr.appendChild(td)
          td.innerHTML = Math.round(obj[key]) + ' hPa'
          break
      }
    })
  })
}

function deleteFromTable() {
  dataTable.innerHTML = ''
}
