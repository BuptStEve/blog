const path = require('path')
const dayjs = require('dayjs')
const fs = require('fs')

module.exports = (options, ctx) => ({
  plugins: [
    ['@vuepress/search', {
      searchMaxSuggestions: 10,
    }],
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp) => {
          const dayjs = require('dayjs')
          return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
        },
      },
    ],
  ],
  enhanceAppFiles: path.resolve(__dirname, 'enhanceApp.js'),
  chainMarkdown (config) {
    config.plugin('toc').tap(([options]) => [
      Object.assign(options, {
        includeLevel: [1, 2, 3, 4, 5, 6],
        forceFullToc: true,
        listType: 'ol',
        format: headingAsString => headingAsString,
      }),
    ])

    config
      .plugin('anchor')
      .tap(([options]) => [
        Object.assign(options, { level: [1, 2, 3, 4, 5, 6] }),
      ])
  },
  alias: {
    imData: path.resolve(__dirname, 'data'),
    imUntil: path.resolve(__dirname, 'until'),
    imStyles: path.resolve(__dirname, 'styles'),
    imRouter: path.resolve(__dirname, 'router'),
    imComponents: path.resolve(__dirname, 'components'),
  },
  async ready () {
    // 排序函数
    const postsSorter = (prev, next) => {
      const prevTime =
                new Date(prev.frontmatter.date).getTime() ||
                new Date(prev.lastUpdated).getTime() ||
                new Date().getTime()
      const nextTime =
                new Date(next.frontmatter.date).getTime() ||
                new Date(next.lastUpdated).getTime() ||
                new Date().getTime()
      return prevTime - nextTime > 0 ? -1 : 1
    }
    const { pages } = ctx

    // 开始格式化和排序
    let posts = pages.filter(({ path }) => /^\/posts\//.test(path))

    if (process.env.NODE_ENV !== 'production') {
      posts = posts.concat(
        pages.filter(({ path }) => /^\/drafts\//.test(path))
      )
    }

    posts.sort(postsSorter)

    // 存放最终数据的变量
    let archived = []
    let tagsList = {}
    let poList = []
    let search = []

    posts.forEach((val, index) => {
      // 遍历posts目录生成包含所有文章信息的 archived
      let page = {}
      let sear = {}
      let { excerpt, lastUpdated, path, _strippedContent } = val
      let { tags, title } = val.frontmatter
      _strippedContent = _strippedContent
        .replace(/[\n\r]/g, ' ')
        .replace(/\s+/, ' ')
      excerpt =
                excerpt ||
                (_strippedContent.slice(0, 200)
                  ? _strippedContent.slice(0, 200) + '......'
                  : false) ||
                ''

      lastUpdated =
                val.frontmatter.date ||
                lastUpdated ||
                dayjs().format('YYYY-MM-DD HH:mm:ss')
      lastUpdated = changeDate(lastUpdated)
      tags = tags || ''
      title = title || ''

      page.excerpt = excerpt
      page.tags = tags
      page.id = index
      page.title = title
      page.lastUpdated = lastUpdated
      page.path = path

      sear.title = title
      sear.path = path
      sear.strippedContent = _strippedContent

      archived.push(page)
      search.push(sear)

      // 生成标签页的数据
      // 剔除不需要的数据
      const t = {}
      t.lastUpdated = lastUpdated
      t.tags = tags
      t.id = index
      t.title = title
      t.path = path

      if (!tags) {
        if (!tagsList['未分类']) {
          tagsList['未分类'] = [{ name: '未分类' }]
        }
        tagsList['未分类'].push(t)
      } else {
        tags.forEach(tag => {
          if (tag === undefined) {
            if (!tagsList['未分类']) {
              tagsList['未分类'] = [{ name: '未分类' }]
            }
            tagsList['未分类'].push(t)
          }
          if (!tagsList[tag]) {
            tagsList[tag] = [{ name: tag }]
          }
          tagsList[tag].push(t)
        })
      }
    })

    // 生成全部文章页所需要的数据
    let index = 0
    archived.forEach((val, i) => {
      let result1 = changeTime(val.lastUpdated)
      let result2

      if (archived.length === 1) {
        poList[0] = [result1[0]]
        return poList[0].push(val)
      }
      if (i + 1 !== archived.length) {
        result2 = changeTime(archived[i + 1].lastUpdated)
      } else {
        result2 = changeTime(archived[i - 1].lastUpdated)
      }
      if (!poList[index]) {
        poList[index] = [result1[0]]
      }
      if (!poList[index]) {
        poList[index] = [result2[0]]
      }
      poList[index].push(val)
      if (result1[1] !== result2[1]) {
        index++
      }
    })

    const dataPath = path.resolve(__dirname, 'data')
    console.log('正在写入本地数据,加快在客户端的速度~~')

    fs.writeFile(
      `${dataPath}/content.js`,
      `export default ${JSON.stringify(archived, null, 2)};`,
      error => {
        if (error) { return console.log('写入首页content文件失败,原因是' + error.message) }
        console.log('写入首页content文件成功')
      }
    )

    fs.writeFile(
      `${dataPath}/tagsList.js`,
      `export default ${JSON.stringify(tagsList, null, 2)};`,
      error => {
        if (error) {
          return console.log(
            '写入标签页tagsList文件失败,原因是' + error.message
          )
        }
        console.log('写入标签页tagsList文件成功')
      }
    )

    // fs.writeFile(
    //     `${dataPath}/search.js`,
    //     `export default ${JSON.stringify(search, null, 2)};`,
    //     error => {
    //         if (error) { return console.log('写入搜索search文件失败,原因是' + error.message) }
    //         console.log('写入搜索search文件成功')
    //     }
    // )

    fs.writeFile(
      `${dataPath}/poList.js`,
      `export default ${JSON.stringify(poList, null, 2)};`,
      error => {
        if (error) { return console.log('写入归档页poList文件失败,原因是' + error.message) }
        console.log('写入归档页poList文件成功')
      }
    )

    // 格式化 lastUpdated
    function changeDate (dateStr) {
      if (dateStr.length === 18) {
        let arr1 = dateStr.split(' ')
        let arr2 = arr1[0].split('-')
        let month = arr2[1].length === 2 ? arr2[1] : '0' + arr2[1]
        return arr2[0] + '-' + month + '-' + arr2[2] + ' ' + arr1[1]
      } else if (dateStr.length === undefined) {
        let str = JSON.stringify(dateStr, null, 2)
        return str.slice(1, 11) + ' ' + str.slice(12, -6)
      } else {
        return dateStr
      }
    }
    // 进一步个性化 lastUpdated,全部文章页中使用
    function changeTime (dateStr) {
      let str = ''
      str = dateStr.slice(0, 7)
      const arr = str.split('-')
      let result = [arr[0] + '-' + arr[1], Number(arr[0]) + Number(arr[1])]
      return result
    }
  },
})
