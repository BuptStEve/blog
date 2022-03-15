<template>
  <div class="content-header index-header">
    <div class="container fade-scale in">
      <h1
        id="conentHeader"
        class="title"
        :class="{'post-content-header':isPosts}"
      >
        {{ title }}
      </h1>
      <h5 class="subtitle">
        {{ description }}
      </h5>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FixedHeader',
  props: {
    content: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data () {
    return {
      title: '',
      isPosts: false,
      description: '',
    }
  },
  computed: {
    routePath () {
      return this.$route.path.slice(1, 6)
    },
  },
  watch: {
    routePath () {
      this.isPosts = this.routePath === 'posts'

      switch (this.routePath) {
      case 'posts':
        this.title = this.$page.title
        this.description = this.$page.lastUpdated
          ? '最后更新时间：' + this.$page.lastUpdated
          : ''
        break
      case 'all/':
        this.title = this.$themeConfig.menus.all || '时间归档'
        if (this.content.length === 0) {
          return (this.description = '')
        }
        setTimeout(() => {
          this.description =
                            this.content[this.content.length - 1].lastUpdated.slice(0, 7) +
                            '~' +
                            this.content[0].lastUpdated.slice(0, 7) +
                            ' ===>>> 共' +
                            this.content.length +
                            '篇'
        }, 20)
        break
      case 'tags/':
        this.title = ''
        this.description = ''
        break
      case 'about':
        this.title = this.$themeConfig.menus.about || '自我介绍'
        this.description = ''
        break
      default:
        this.title = this.$site.title || '欢迎光临'
        this.description = this.$site.description || '期待与你的交流'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.content-header {
    padding: 49px 16px 45px 354px;
    margin-left: -249px;
    width: 100%;
    color: #fff;
    background: #3f51b5;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

.content-header .subtitle {
    padding-top: 11px;
    font-weight: 300;
    color: #c5cae9;
    font-size: 18px;
    line-height: 24px;
}

.content-header .title {
    font-weight: 500;
    font-size: 44px;
    line-height: 48px;
}
.post-content-header {
    font-weight: 400;
    font-size: 33px;
    line-height: 48px;
}
@media (max-width: 1200px) {
    .content-header {
        margin-left: 0;
        padding-left: 21px;
        width: auto;
    }
    .content-header .title {
        font-size: 28px;
    }
}
</style>
