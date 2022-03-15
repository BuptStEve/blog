module.exports = {
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
