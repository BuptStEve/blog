import { DefaultThemeConfig, defineConfig4CustomTheme } from 'vuepress/config';
import { name, description } from '../package.json'

interface MyThemeConfig extends DefaultThemeConfig {
  email: string;
  github: string;
  brand: string;
  avatar: string;
  author: string;
  pagination: string;
  vssue: Record<string, unknown>;
  menus: Record<string, string>;
}

export default defineConfig4CustomTheme<MyThemeConfig>({
  base: `/${name}/`,
  dest: './dist',
  title: 'BuptStEve\'s Blog',
  description: 'Talk is cheap show me the offer!',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  locales: {
    '/': { lang: 'zh-CN', title: name, description },
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: [],
  evergreen: true,
  themeConfig: {
    repo: 'BuptSteve/blog',
    avatar: '/avatar.jpg',
    author: 'StEve Young',
    brand: '/class-struggle.jpg',
    email: 'yangzhenyu2016@gmail.com',
    github: 'https://github.com/BuptStEve',
    pagination: '5',
    vssue: {
      need: false,
      development: {
        // 开发环境下的配置
        clientId: '',
        clientSecret: '',
        owner: '',
        repo: '',
        locale: 'zh',
      },
      production: {
        // 生产环境的配置
        clientId: '',
        clientSecret: '',
        owner: '',
        repo: '',
        locale: 'zh',
      },
    },
    menus: {
      home: '文章列表',
      tags: '标签分类',
      all: '时间归档',
      github: 'Github',
      about: '自我介绍',
    },
  },
});
