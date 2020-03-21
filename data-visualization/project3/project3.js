/*
// Data sample
// variance = 分散、ばらつき
{
  "baseTemperature": 8.66,
  "monthlyVariance": [
    {
      "year": 1753,
      "month": 1,
      "variance": -1.366
    },
    {
      "year": 1753,
      "month": 2,
      "variance": -2.223
    },
    ....
   ]
}

// 横軸は年 (year)
// 縦軸は月 (month)
// 分散（偏差）は、色分けする
*/

// 外部データの読み込みには d3-fetch を利用する
//   - Ref: https://github.com/d3/d3-fetch/tree/v1.1.2
// データソースを指定
// const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'
const url = './global-temperature.json'

// カラースケール
const colors = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']

// d3.jsonを利用 (D3の4系で)
d3.json(url, (_err, data) => {
  const monthlyVariance = data.monthlyVariance

  // グラフの描画領域
  // グラフを描画するエリアの横幅（ここに左側にY軸を配置するために追加でマージンが要る)
  const width = 1500

  // グラフを描画するエリアの縦の長さ（ここに下側にX軸を配置するために追加でマージンが要る
  const height = 470

  // SVGの領域は、メモリ分の余白を含んで 900 x 460
  // d3.appendを使わなくてもSVG部分はサイズ指定でHTMLに配置していてもOK
  const svgContainer = d3.select('.visHolder').append('svg')
    .attr('width', width + 100)
    .attr('height', height + 100)

  // ツールチップを描画する領域
  // 中身はJavaScriptで動的に書き換えるので初期状態ではブランク、非表示に設定
  // d3.appendを使わなくてもTooltip部分もサイズ指定でHTMLに配置していてもOK
  const tooltip = d3.select('.visHolder').append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)
    .style('display', 'none')

  // x軸描画のために日付のみ配列に入れる
  const yearsDate = monthlyVariance.map((item) => { return item['year'] })

  // y軸描画のためにmonthのみ配列に入れる
  const monthData = monthlyVariance.map((item) => { return item['month'] })

  const baseTemperature = data.baseTemperature
  const temperatureData = monthlyVariance.map((item) =>  { return (item['variance'] + baseTemperature) })

  const maxTemperature = d3.max(temperatureData)
  const minTemperature = d3.min(temperatureData)

  // x軸用の最大値、最小値をとりだす（各軸の幅の指定のため）
  const xMax = d3.max(yearsDate)
  const xMin = d3.min(yearsDate)

  // scaleTimeを使うと、時間ベースでのスケールを定義できる
  // 範囲は一番古い日付 - 新しい日付
  // ベースにするx軸の長さは800
  const xScale = d3.scaleLinear()
    .domain([xMin, xMax])
    .range([0, width])

  // 上記の定義をもとにx軸を定義
  // tickFormat で、メモリの数値のフォーマットを指定（整数)
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format('d'))

  // 左端からマージン70移動させる
  // 上部から高さ470に対してメモリ描画の幅を40に設定
  svgContainer.append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(70, 470)')
    .call(xAxis)

  // y軸はscaleBand()
  const yScale = d3.scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .rangeRound([0, height - 20])

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // const yAxis = d3.axisLeft(yScale).tickFormat(d3.format('d'))
  const yAxis = d3.axisLeft(yScale).tickFormat((d) => {
    return monthNames[d]
  })

  // 左端からマージン60移動させる
  // 上部から描画域まで下げる
  // g要素をまず作成し、原点を60, 0 (x, y) に設定
  // そこにcallでyAxisを当てはめると軸が描画（下方向に）
  svgContainer.append('g')
    .attr('id', 'y-axis')
    .attr('class', 'line')
    .attr('transform', 'translate(70, ' + 20 + ')')
    .call(yAxis)

  const legendColors = colors.reverse()

  // バーの表示
  const barWidth = width / (xMax - xMin)

  // selectAllは、その要素がなければあとからappendで作成
  // data(実際のデータ)を設定し、enter() を使うと、データ数に応じた要素を作成してくれる
  // g要素で、SVGの要素をグループ化できる
  svgContainer.append('g')
    .attr('transform', 'translate(70, 2)')
    .selectAll('rect')
    .data(monthlyVariance)
    .enter()
    .append('rect') // <rect></rect> はx、yの値を持つ（高さと幅も必要）
    .attr('class', 'map')
    .attr('class', 'cell')
    .attr('data-year', (d) => { return d.year })
    .attr('data-month', (d) => { return d.month - 1 })
    .attr('data-temp', (d) => { return d.variance + baseTemperature })
    .attr('data-variance', (d) => { return d.variance })
    .attr('x', (d) => { return xScale(d.year) + 1 })
    .attr('y', (d, i) => { return yScale(d.month - 1) +  yScale.bandwidth() / 2 })
    .attr('width', barWidth)
    .attr('height', yScale.bandwidth())
    .attr('fill', (d) => {
      let value = baseTemperature + d.variance - 2.5
      let index = Math.floor(value)
      if (index > 10) {
        index = 10
      }
      if (index < 0) {
        index = 0
      }
      return legendColors[index]
    })
    .on('mouseover', (d) => {
      tooltip.style('opacity', 1)
      tooltip.style('display', 'block')
      tooltip.attr('data-year', d.year)
      tooltip.html(
        `Year: ${d.year} / Month: ${monthNames[d.month - 1]}<br/>` +
        `Temperature: ${d3.format('.1f')(d.variance + baseTemperature)}<br/>` +
        `Variance: ${d3.format('.1f')(d.variance)}`
      )
      tooltip.style('left', xScale(d.year) + 30)
      tooltip.style('top', yScale(d.month - 1) + 20)
      tooltip.style('transform', 'translateX(60px)')
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0)
      tooltip.style('display', 'none')
      tooltip.html('')
    })

  let legendWidth = 440
  let legendHeight = 100

  const legend = svgContainer.append('g')
    .attr('id', 'legend')
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .selectAll('rect')
    .data(legendColors)
    .enter()

  const legendScale = d3.scaleLinear()
    .domain([minTemperature, maxTemperature])
    .range([0, 440])

  // 上記の定義をもとにx軸を定義
  // tickFormat で、メモリの数値のフォーマットを指定（整数)
  const legendXaxis = d3.axisBottom(legendScale)
    .tickFormat(d3.format('.1f'))

  legend.append('g')
    .attr('id', 'legend-axis')
    .attr('transform', 'translate(100, 530)')
    .call(legendXaxis)

  legend.append('rect')
    .attr('y', 500)
    .attr('x', (d, i) => { return i * 40 + 100 })
    .attr('width', 40)
    .attr('height', 30)
    .attr('fill', (d, i) => { return legendColors[i] })
})
