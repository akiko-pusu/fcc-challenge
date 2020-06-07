// DOMがロードされてから描画を開始
document.addEventListener('DOMContentLoaded', (e) => {
  let body = d3.select('body')

  // svgを取得する
  const svg = d3.select('svg')

  // Tooltipの領域を作成する(デフォルト非表示)
  let tooltip = body.append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('opacity', 0)

  /*
    geoPathを利用
    https://github.com/d3/d3-geo
  */
  let path = d3.geoPath()

  // 凡例を描画するため、スケールを設定（educationデータの最小＆最大値）
  let x = d3.scaleLinear()
    .domain([2.6, 75.1])
    .rangeRound([600, 860]) //実際の長さとしての範囲をいくつからいくつにするか (横方向600から幅260で設定)

  // 色の設定 / d3-scale-chromaticを利用します。
  // https://github.com/d3/d3-scale-chromatic#schemeGreens で9段階
  let color = d3.scaleThreshold()
    .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
    .range(d3.schemeGreens[9])

  // グループ化できるように凡例部分を設定 （svg領域のx: 0, y: 40で配置）
  let g = svg.append('g')
    .attr('class', 'key')
    .attr('id', 'legend')
    .attr('transform', 'translate(0, 40)')

  // colorのレンジ分だけrectを作成する
  g.selectAll('rect')
    .data(color.range().map(function (d) { // 対応するデータを用意
      d = color.invertExtent(d)
      if (d[0] == null) d[0] = x.domain()[0]
      if (d[1] == null) d[1] = x.domain()[1]
      return d
    }))
    .enter().append('rect')
    .attr('height', 8)
    .attr('x', function (d) {
      return x(d[0])
    })
    .attr('width', function (d) {
      return x(d[1]) - x(d[0])
    })
    .attr('fill', function (d) {
      return color(d[0])
    })

  // 凡例に対してテキストを添えます
  g.append('text')
    .attr('class', 'caption')
    .attr('x', x.range()[0])
    .attr('y', -6)
    .attr('fill', '#000')
    .attr('text-anchor', 'start')
    .attr('font-weight', 'bold')

  // 凡例の下側にメモリを描画: selection.call でオブジェクトに対して、指定した関数を実行
  g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickFormat(function (x) {
      return Math.round(x) + '%'
    })
    .tickValues(color.domain()))
    .select('.domain')
    .remove()

  // TopoJSONのデータを取得します
  const COUNTY_FILE = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'
  const EDUCATION_FILE = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json'

  let promises = []
  promises.push(d3.json(COUNTY_FILE))
  promises.push(d3.json(EDUCATION_FILE))

  // d3.jsのv5ではPromiseを利用
  Promise.all(promises).then(function (values) {
    ready(values)
  })

  function ready (values) {
    // Promise.allで各d3.json(）の結果が配列で渡される
    let us = values[0]
    let education = values[1]

    // TopoJSONを使ってデータを調整: convert TopoJSON to GeoJSON.
    // topojson.feature():
    //   Returns the GeoJSON Feature or FeatureCollection for the specified object in the given topology.
    // USのデータの中から、州 -> 地方政府（County)を抽出
    // 描画はGeoJSON形式にする必要があります
    svg.append('g')
      .attr('class', 'counties')
      .selectAll('path')
      .data(topojson.feature(us, us.objects.counties).features)
      .enter().append('path')
      .attr('class', 'county')
      .attr('data-fips', function (d) {
        return d.id
      })
      .attr('data-education', function (d) {
        let result = education.filter(function (obj) {
          // 地方のIDと一致するか
          return obj.fips === d.id
        })
        if (result[0]) {
          return result[0].bachelorsOrHigher
        }
        //could not find a matching fips id in the data
        console.log('could find data for: ', d.id)
        return 0
      })
      .attr('fill', function (d) {
        let result = education.filter(function (obj) {
          return obj.fips === d.id
        })
        if (result[0]) {
          return color(result[0].bachelorsOrHigher)
        }
        //could not find a matching fips id in the data
        return color(0)
      })
      .attr('d', path)
      .on('mouseover', function (d) {
        tooltip.style('opacity', 0.9)
        tooltip.html(function () {
          let result = education.filter(function (obj) {
            return obj.fips === d.id
          })
          if (result[0]) {
            return result[0]['area_name'] + ', ' + result[0]['state'] + ': ' + result[0].bachelorsOrHigher + '%'
          }
          //could not find a matching fips id in the data
          return 0
        })
          .attr('data-education', function () {
            let result = education.filter(function (obj) {
              return obj.fips == d.id
            })
            if (result[0]) {
              return result[0].bachelorsOrHigher
            }
            //could not find a matching fips id in the data
            return 0
          })
          .style('left', (d3.event.pageX + 10) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px')
      })
      .on('mouseout', function (d) {
        tooltip.style('opacity', 0)
      })

    // topojson.meshで州の境界を描画
    // <path/> 要素に値はd属性で渡す
    svg.append('path')
      .attr('class', 'state-borders')
      .attr('d', path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b })))
  }
})
