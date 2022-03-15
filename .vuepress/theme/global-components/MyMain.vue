<template>
    <el-main class="my-main" :style="{marginLeft:mainLeft+'px'}">
        <content-header :content="content"/>
        <keep-alive>
            <component :is="whichComponent" :content="content"/>
        </keep-alive>
    </el-main>
</template>

<script>
export default {
  name: 'Main',
  props: {
    isHide: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    All: () => import('imComponents/All'),
    Tags: () => import('imComponents/Tags'),
    Home: () => import('imComponents/Home'),
    Posts: () => import('imComponents/Posts'),
    About: () => import('imComponents/About'),
  },
  computed: {
    whichComponent () {
      if (typeof window === 'undefined') return 'Home'

      let w = ''
      switch (this.$route.path.slice(1, 6)) {
      case 'posts':
      case 'draft':
        w = 'Posts'
        break
      case 'all/':
        w = 'All'
        document.title =
                    this.$themeConfig.menus.all + ' · ' + this.$site.title
        break
      case 'tags/':
        w = 'Tags'
        document.title =
                    this.$themeConfig.menus.tags +
                    '  ·  ' +
                    this.$site.title
        break
      case 'about':
        w = 'About'
        document.title =
                    this.$themeConfig.menus.about +
                    ' · ' +
                    this.$site.title
        break
      default:
        w = 'Home'
        document.title =
                    this.$themeConfig.menus.home + ' · ' + this.$site.title
      }

      if (this.$route.path.indexOf('/tags/') > -1 && !w) {
        w = 'Tags'
        document.title =
                    this.$themeConfig.menus.tags +
                    ' · ' +
                    this.$route.params.tag +
                    ' · ' +
                    this.$site.title
      }

      return w
    },
    mainLeft () {
      return this.isHide ? 60 : 230
    },
  },
}
</script>

<style lang="stylus" scoped>
.my-main {
    margin: 56px 0 0 240px;
    transition: 0.2s ease-in-out;
    padding: 0;
    overflow: hidden;
    padding-bottom: 113px;
    width: 100%;
}

@media (max-width: 1200px) {
    .my-main {
        margin-left: 0 !important;
    }
}
</style>
