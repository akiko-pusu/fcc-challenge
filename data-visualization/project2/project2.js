/*
// Data sample
[
  {
    "Time": "36:50",
    "Place": 1,
    "Seconds": 2210,
    "Name": "Marco Pantani",
    "Year": 1995,
    "Nationality": "ITA",
    "Doping": "Alleged drug use during 1995 due to high hematocrit levels",
    "URL": "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
  },
  {
    "Time": "36:55",
    "Place": 2,
    "Seconds": 2215,
    "Name": "Marco Pantani",
    "Year": 1997,
    "Nationality": "ITA",
    "Doping": "Alleged drug use during 1997 due to high hermatocrit levels",
    "URL": "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
  }
]

- Dopingがブランクの場合は "" になっている
- y軸にTime, x軸にYearを使うみたい
- 重複があるので、ドットで描画
- 自転車レースでのドーピングのデータを扱っているみたい
- ラルプ・デュエズっていうのが出てくるので、ツールドフランスかな？
- https://ja.wikipedia.org/wiki/%E3%83%A9%E3%83%AB%E3%83%97%E3%83%BB%E3%83%87%E3%83%A5%E3%82%A8%E3%82%BA
*/

// 外部データの読み込みには d3-fetch を利用する
//   - Ref: https://github.com/d3/d3-fetch/tree/v1.1.2
// データソースを指定
// const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
const url = './cyclist-data.json'

// グラフの描画領域
// 棒グラフを描画するエリアの横幅（ここに左側にY軸を配置するために追加でマージンが要る
const width = 800

// 棒グラフを描画するエリアの縦の長さ（ここに下側にX軸を配置するために追加でマージンが要る
const height = 460

// d3.jsonを利用 (D3の4系で)
d3.json(url, (_err, data) =>
{

  // SVGの領域は、メモリ分の余白を含んで 900 x 460
  // d3.appendを使わなくてもSVG部分はサイズ指定でHTMLに配置していてもOK
  /*
  const svgContainer = d3.select('.visHolder').append('svg')
    .attr('width', width + 100)
    .attr('height', height + 60)
  */
  const svgContainer = d3.select('svg')

  // ツールチップを描画する領域
  // 中身はJavaScriptで動的に書き換えるので初期状態ではブランク、非表示に設定
  // d3.appendを使わなくてもTooltip部分もサイズ指定でHTMLに配置していてもOK
  /*
  const tooltip = d3.select('.visHolder').append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)
    .style('display', 'none')
  */
  const tooltip = d3.select('#tooltip')

  // x軸描画のために日付のみ配列に入れる
  let yearsDate = data.map((item) => { return item['Year'] })

  // y軸描画のためにGDPのみ配列に入れる
  let timesData = data.map((item) => {
    const time = item['Time']
    const parsedTime = time.split(':')
    return new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1])
  })

  // x軸用の最大値、最小値をとりだす（各軸の幅の指定のため）
  const xMax = d3.max(yearsDate) + 1
  const xMin = d3.min(yearsDate) - 1

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

  // 左端からマージン60移動させる
  // 上部から高さ400に対してメモリ描画の幅を40に設定
  // 400 - 40 = 360で、上から360下げた位置に軸を配置
  // 目盛りが下向きに360から400の間で描画
  // g要素をまず作成し、原点を60, 360 (x, y) に設定
  // そこにcallでxAxisを当てはめると軸が描画
  svgContainer.append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(60, 420)')
    .call(xAxis)

  svgContainer.append('g')
    .attr('class', 'grid')
    .attr('transform', 'translate(60,' + (height - 40) + ')')
    .call(d3.axisBottom(xScale).ticks(40).tickSize(-380).tickFormat(''))

  // y軸を考える（最小値は0に設定するため、最高値を取得）
  const yMax = d3.max(timesData)
  const yMin = d3.min(timesData)

  // y軸は普通のscaleLinear
  // 下側が0、上側が数値がおおきくなるので、レンジはx軸と揃えた高さから開始
  // 見出しとかぶらないように上から20の位置に設定
  const yScale = d3.scaleTime()
    .domain([yMax, yMin])
    .range([420, 40])

  const timeFormat = d3.timeFormat('%M:%S')
  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat)

  // 左端からマージン60移動させる
  // 上部から描画域まで下げる
  // g要素をまず作成し、原点を60, 0 (x, y) に設定
  // そこにcallでyAxisを当てはめると軸が描画（下方向に）
  svgContainer.append('g')
    .attr('id', 'y-axis')
    .attr('class', 'line')
    .attr('transform', 'translate(60, 0)')
    .call(yAxis)

  svgContainer.append('g')
    .attr('class', 'grid')
    .attr('transform', 'translate(60, 0)')
    .call(
      d3.axisLeft(yScale).ticks(20).tickSize(-800).tickFormat('')
    )

  // 凡例用の設定
  const dopings = [ 'No doping allegations', 'Riders with doping allegations' ]
  const colors = [ '#ed7968', 'darkred' ]
  const colorScale = d3.scaleOrdinal().domain(dopings).range(colors)

  // 凡例の表示
  // 指定のdivの中にSVGを作成
  // このSVGの中でまず凡例のマークにあたる四角を描画する準備をする
  const legend = d3.select('.legend')
    .append('svg')
    .attr('id', 'legend')
    .attr('width', 260)
    .attr('height', 50)
    .selectAll('rect')
    .data(dopings)
    .enter()

  // 実際に凡例の10 x 10の四角を作成し、色を割り当て
  legend.append('rect')
    .attr('x', 20)
    .attr('y', (d, i) => { return i * 20 + 10 })
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', (d) => { return colorScale(d) })

  // 凡例データの個数分だけ、四角の横にテキストを横に配置 (絶対位置で)
  legend.append('text')
    .attr('x', 40) // 20ほど離す
    .attr('y', (d, i) => { return i * 20 + 20 })
    .text((d, i) => { return dopings[i] })

  // dotの表示
  svgContainer.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot') // dotというクラスを持つ
    .attr('data-xvalue', (d, i) => yearsDate[i]) // プロパティに実際の値
    .attr('data-yvalue', (d, i) => timesData[i])
    .attr('cx', (d, i) => xScale(yearsDate[i]) + 60) // x方向のマージンを加味してずらす
    .attr('cy', (d, i) => yScale(timesData[i]))
    .attr('r', 5)
    .attr('fill', (d, i) => {
      if (d.Doping === '') {
        return colors[0]
      }
      return colors[1]
    })
    // マウスオーバー時にツールチップを表示
    // 位置はposition: absolute なので left / top を使って調整
    .on('mouseover', (d, i) => {
      tooltip.style('opacity', 0.9)
      tooltip.style('display', 'block')
      tooltip.attr('data-year', d.Year)
      tooltip.attr('data-xvalue', d.Time)
      tooltip.html(`${d.Name}: ${d.Nationality}<br/>Year: ${d.Year} / Time: ${d.Time}`)
      tooltip.style('left', xScale(yearsDate[i]) + 100)
      tooltip.style('top', yScale(timesData[i]))
      tooltip.style('transform', 'translateX(60px)')
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0)
      tooltip.style('display', 'none')
      tooltip.html('')
    })
})
