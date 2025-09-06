import { glob } from 'glob'
import { defineConfig } from 'vitepress'

// 自动获取 posts 目录下的 MD 文件
const getPosts = (dir = 'posts') => {
  const posts = glob.sync(`docs/${dir}/**/*.md`).map((file) => {
    const path = file.replace('docs/', '').replace('.md', '')
    const [date, slug] = path.split('/').slice(-2)
    const sortIndex = +slug.match(/\d+/)?.[0] || new Date()
    return { text: slug, link: path, date, sortIndex }
  })
  return posts.sort((a, b) => a.sortIndex - b.sortIndex)
}

const dailyPosts = getPosts('daily')
console.log(JSON.stringify(dailyPosts))

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Island",
  description: "My Log",
  base: '/my-blog-app/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '查看日志', link: dailyPosts[0].link },
      // { text: 'Examples', link: '/markdown-examples' }
    ],
    sidebar: [
      {
        text: '技术',
        items: getPosts()
      },
      {
        text: '日常',
        items: dailyPosts
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    markdown: {
      theme: {
        light: 'github-light',
        dark: 'material-theme-palenight'
      },
      lineNumbers: true // 显示代码行号
    }
  },
  outDir: '../public',
  ignoreDeadLinks: true
})
