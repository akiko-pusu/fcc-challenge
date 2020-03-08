/*
    // Data sample　（3ヶ月ごとのGDPを添えている）
    [
      "1947-01-01",
      243.1
    ],
    [
      "1947-04-01",
      246.3
    ],
    ...
    [
      "2015-07-01",
      18064.7
    ]
*/

// 外部データの読み込みには d3-fetch を利用する
//   - Ref: https://github.com/d3/d3-fetch/tree/v1.1.2
// データソースを指定
const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

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

  // ここから先がd3.jsonでリクエストを送信、結果が出た後
  const dataCount = data.data.length
  const barWidth = width / dataCount

  // x軸描画のために日付のみ配列に入れる
  let yearsDate = data.data.map((item) => { return item[0] })

  // y軸描画のためにGDPのみ配列に入れる
  let gdpData = data.data.map((item) => { return item[1] })

  // x軸用の最大値、最小値をとりだす（各軸の幅の指定のため）
  const xMax = d3.max(yearsDate)
  const xMin = d3.min(yearsDate)

  // scaleTimeを使うと、時間ベースでのスケールを定義できる
  // 範囲は一番古い日付 - 新しい日付
  // ベースにするx軸の長さは800
  const xScale = d3.scaleTime()
    .domain([new Date(xMin), new Date(xMax)])
    .range([0, width])

  // 上記の定義をもとにx軸を定義
  const xAxis = d3.axisBottom(xScale)

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

  // y軸を考える（最小値は0に設定するため、最高値を取得）
  const yMax = d3.max(gdpData)
  // const yMin = d3.min(gdpData)

  // y軸は普通のscaleLinear
  // 下側が0、上側が数値がおおきくなるので、レンジはx軸と揃えた高さから開始
  // 見出しとかぶらないように上から20の位置に設定
  const yScale = d3.scaleLinear()
    .domain([0, yMax])
    .range([420, 40])

  const yAxis = d3.axisLeft(yScale)

  // 左端からマージン60移動させる
  // 上部から描画域まで下げる
  // g要素をまず作成し、原点を60, 0 (x, y) に設定
  // そこにcallでyAxisを当てはめると軸が描画（下方向に）
  svgContainer.append('g')
    .attr('id', 'y-axis')
    .attr('transform', 'translate(60, 0)')
    .call(yAxis)

  // バーの表示
  // selectAllは、その要素がなければあとからappendで作成
  // data(実際のデータ)を設定し、enter() を使うと、データ数に応じた要素を作成してくれる
  svgContainer.append('g')
    .selectAll('rect')
    .data(data.data)
    .enter()
    .append('rect') // <rect></rect> はx、yの値を持つ（高さと幅も必要）
    .attr('class', 'bar')
    .attr('data-date', (d) => { return d[0] })
    .attr('data-gdp', (d) => { return d[1] })
    .attr('x', (d) => { return xScale(new Date(d[0])) + 60 })
    .attr('y', (d) => { return yScale(d[1]) })
    .attr('width', barWidth)
    .attr('height', (d) => { return height - 40 - yScale(d[1]) })
    .attr('fill','#ed7968')
    // マウスオーバー時にツールチップを表示
    // 位置はposition: absolute なので left / top を使って調整
    .on('mouseover', (d, i) => {
      tooltip.style('opacity', 0.9)
      tooltip.style('display', 'block')
      tooltip.attr('data-date', d[0])
      tooltip.html(`<b>Date:</b>${d[0]}<br/><b>GDP:</b>${d[1]}`)
      tooltip.style('left', (i * barWidth) + 20)
      tooltip.style('top', height - 100)
      tooltip.style('transform', 'translateX(60px)')
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0)
      tooltip.style('display', 'none')
      tooltip.html('')
    })
})
