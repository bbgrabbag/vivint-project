export const stocksUrl = symbol => `https://api.iextrading.com/1.0/stock/${symbol}/chart/3m`
export const genHexColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);
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
