// データセットの指定（切り替え可能なようにします）
const DATASETS = {
  videogames: {
    TITLE: 'Video Game Sales',
    DESCRIPTION: 'Top 100 Most Sold Video Games Grouped by Platform',
    FILE_PATH: './data/video-game-sales-data.json'
  },
  movies: {
    TITLE: 'Movie Sales',
    DESCRIPTION: 'Top 100 Highest Grossing Movies Grouped By Genre',
    FILE_PATH: './data/movie-data.json'
  },
  kickstarter: {
    TITLE: 'Kickstarter Pledges',
    DESCRIPTION: 'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category',
    FILE_PATH: './data/kickstarter-funding-data.json'
  }
}

// DOMがロードされてから描画を開始
document.addEventListener('DOMContentLoaded', (e) => {
  // svgを取得する
  let urlParams = new URLSearchParams(window.location.search)
  const DEFAULT_DATASET = 'videogames'
  const DATASET = DATASETS[urlParams.get('data') || DEFAULT_DATASET]

  document.getElementById('title').innerHTML = DATASET.TITLE
  document.getElementById('description').innerHTML = DATASET.DESCRIPTION

  // body要素を取得
  let body = d3.select('body')

  // ツールチップ用の領域を作成（位置はどこでもよい）/ デフォルト非表示
  var tooltip = body.append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('opacity', 0)

  let svg = d3.select('#tree-map')
  let width = svg.attr('width')
  let height = svg.attr('height')

  // https://github.com/d3/d3-interpolate
  // 二つの間の値を補完するメソッドを提供してくれる。色のバリエーションや数値などいくつかあるよ！
  // d3.interpolateRgb(a, b)(0.2) は、a - bの範囲を 0 -> 1.0のドメインで補完してくれる。（中間値は0.2)
  // 今回はschemeSpectral[11]で設定してみる
  const fader = (color) => {
    return d3.interpolateRgb(color, '#fff')(0.2)
  }
  const color = d3.scaleOrdinal(d3.schemeSpectral[11].map(fader))
  const format = d3.format(',d')

  // treemapのpaddingInner(1)で隙間を開けてくれる
  let treemap = d3.treemap()
    .size([width, height])
    .paddingInner(1)

  d3.json(DATASET.FILE_PATH)
    .then((data) => {
      // 取得したデータから、value値を持っていないノードを遡って集計し、さらにルートノードを作成
      // ルートノードにも値が設定される
      const root = d3.hierarchy(data)
        .eachBefore((d) => {
          d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name
        })
        .sum(sumBySize)
        .sort((a, b) => {
          return b.height - a.height || b.value - a.value
        })

      // root.valueとすると総合計が設定されます
      treemap(root)

      // rootの子要素の作成、位置調整（まずグループでまとめる）
      let cell = svg.selectAll('g')
        .data(root.leaves())
        .enter().append('g')
        .attr('class', 'group')
        .attr('transform', (d) => {
          return 'translate(' + d.x0 + ',' + d.y0 + ')'
        })

      // 子要素をタイルとして作成
      // rectを描画、サイズを調整、値をdata-属性で設定
      let tile = cell.append('rect')
        .attr('id', (d) => {
          return d.data.id
        })
        .attr('class', 'tile')
        .attr('width', (d) => {
          return d.x1 - d.x0
        })
        .attr('height', (d) => {
          return d.y1 - d.y0
        })
        .attr('data-name', (d) => {
          return d.data.name
        })
        .attr('data-category', (d) => {
          return d.data.category
        })
        .attr('data-value', (d) => {
          return d.data.value
        })
        // カテゴリに対応した色で塗り潰し（"category": "Wii", "category": "PS2" など)
        .attr('fill', (d) => {
          return color(d.data.category)
        })
        .on('mousemove', (d) => {
          console.log('mouseover')
          tooltip.style('opacity', 0.9)
          tooltip.html(
            'Name: ' + d.data.name +
              '<br>Category: ' + d.data.category +
              '<br>Value: ' + d.data.value
          )
            .attr('data-value', d.data.value)
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px')
        })
        .on('mouseout', (d) => {
          tooltip.style('opacity', 0)
        })

      // https://developer.mozilla.org/ja/docs/Web/SVG/Element/text
      // SVGでのテキスト描画を行う
      // tspanは長いテキストの一部分をマークアップするために用います
      cell.append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data((d) => {
          return d.data.name.split(/(?=[A-Z][^A-Z])/g)
        })
        .enter().append('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => {
          return 13 + i * 10
        })
        .text((d) => {
          return d
        })

      // カテゴリを抽出
      let categories = root.leaves().map((nodes) => {

        return nodes.data.category
      })

      /* カテゴリはこのような配列になる (以下の処理で重複を除外)
        ["Wii", "DS", "X360", "GB", "PS3", "NES", "PS2", "3DS", "PS4", "SNES", "PS",
            "N64", "GBA", "XB", "PC", "2600", "PSP", "XOne"]
      */
      categories = categories.filter((category, index, self) => {
        return self.indexOf(category) === index
      })

      // 凡例の描画
      let legend = d3.select('#legend')
      var legendWidth = +legend.attr('width')
      const LEGEND_OFFSET = 10
      const LEGEND_RECT_SIZE = 15
      const LEGEND_H_SPACING = 150
      const LEGEND_V_SPACING = 10
      const LEGEND_TEXT_X_OFFSET = 3
      const LEGEND_TEXT_Y_OFFSET = -2
      let legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING)

      // 各凡例用のグループを定義
      let legendElem = legend
        .append('g')
        .attr('transform', 'translate(60,' + LEGEND_OFFSET + ')')
        .selectAll('g')
        .data(categories)
        .enter().append('g')
        .attr('transform', function (d, i) {
          return 'translate(' +
            ((i % legendElemsPerRow) * LEGEND_H_SPACING) + ',' +
            ((Math.floor(i / legendElemsPerRow)) * LEGEND_RECT_SIZE + (LEGEND_V_SPACING * (Math.floor(i / legendElemsPerRow)))) + ')'
        })

      /* カテゴリごとにこのような形で描画します
        <g transform="translate(0,0)">
         <rect width="15" height="15" class="legend-item" fill="rgb(177, 52, 104)"></rect>
         <text x="18" y="13">Wii</text>
        </g>
      */
      legendElem.append('rect')
        .attr('width', LEGEND_RECT_SIZE)
        .attr('height', LEGEND_RECT_SIZE)
        .attr('class', 'legend-item')
        .attr('fill', function (d) {
          return color(d)
        })

      legendElem.append('text')
        .attr('x', LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
        .attr('y', LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
        .text(function (d) {
          return d
        })
    })
    .catch(() => {
      // エラー処理
      console.log('error')
    })

  function sumBySize (d) {
    return d.value
  }
})
