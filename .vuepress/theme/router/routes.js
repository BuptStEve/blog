const Layout = () => import('../layouts/Layout.vue')

const install = (Vue, { router }) => {
  const routes = ['/', '/all/', '/about/', '/tags/', '/tags/:tag', '/posts/:post', '/drafts/:post']
  routes.forEach((path) => router.addRoute({
    name: path,
    path,
    component: Layout,
  }))

  router.beforeEach((to, from, next) => {
    if (typeof window === 'undefined') return next()

    const loaderWrapper = document.getElementById('loader-wrapper')
    loaderWrapper.style.display = 'block'
    loaderWrapper.style.opacity = '1'
    next()
  })
  router.afterEach(() => {
    if (typeof window === 'undefined') return

    const loaderWrapper = document.getElementById('loader-wrapper')
    loaderWrapper.style.opacity = '0'

    setTimeout(() => {
      loaderWrapper.style.display = 'none'
    }, 200)
  })
}

export default {
  install,
}
