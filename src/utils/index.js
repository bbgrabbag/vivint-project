export const stocksUrl = symbol => `https://api.iextrading.com/1.0/stock/${symbol}/chart/3m`
export const genHexColor = () => '#' + (Math.random().toString(16) + '000000').slice(2, 8)
export const parseStockData = data => {
  const output = [];
  for (let key in data) {
    data[key].forEach((dataPoint, i) => {
      if (!output[i]) {
        output[i] = {
          [key]: dataPoint.high,
          name: dataPoint.date
        }
      } else {
        output[i][key] = dataPoint.high
      }
    })
  }
  return output;
}
