const { name, description } = require('../package.json')

module.exports = {
    base: '/' + name + '/',
    dest: './dist',
    title: 'BuptStEve\'s Blog',
    description: 'Talk is cheap show me the offer!',
    head: [
        ['link', { rel: 'icon', href: `/favicon.ico` }],
    ],
    theme: 'indigo-material',
    locales: {
        '/': { lang: 'zh-CN', title: name, description },
    },
    markdown: {
        lineNumbers: true,
    },
    plugins: [
        [
            '@vuepress/last-updated',
            {
                transformer: (timestamp) => {
                    const moment = require('moment')
                    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
                },
            },
        ],
    ],
    evergreen: true,
    serviceWorker: true,
    themeConfig: {
        placeholder: '搜搜看',
        searchReply: '什么都没搜到，试一下其它搜索词~',
        author: 'StEve Young',
        email: 'yangzhenyu2016@gmail.com',
        pagination: '5',
        avatar: '/avatar.jpg',
        brand: '/class-struggle.jpg',
        github: 'https://github.com/BuptStEve',
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
    serviceWorker: {
        updatePopup: {
            message: 'New content is available.',
            buttonText: 'Refresh',
        },
    },
}
