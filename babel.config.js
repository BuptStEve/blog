module.export = {
    presets: [['es2015', { modules: false }]],
    plugins: [
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk',
            },
            {
                libraryName: 'element-ui',
                styleLibraryName: '~theme',
            },
        ],
    ],
}
