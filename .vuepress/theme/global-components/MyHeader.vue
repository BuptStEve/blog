<template>
  <el-header
    id="topHeader"
    :style="{paddingLeft:headerLeft+'px'}"
    class="top-header"
    :class="{headerShadow:hasShadow}"
  >
    <el-row
      type="flex"
      align="middle"
      class="header-warp"
    >
      <el-col :span="12">
        <el-row
          type="flex"
          align="middle"
        >
          <el-col :span="2">
            <el-button
              type="primary"
              :circle="true"
              @click="clickMenu"
            >
              <i
                class="iconfont"
                :class="[iconName]"
              />
            </el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col
        :span="20"
        :xs="{span:21}"
      >
        <div class="grid-content bg-purple-light">
          <el-row
            type="flex"
            align="middle"
            justify="end"
          >
            <SearchBox />

            <!-- repo link -->
            <a
              v-if="repoLink"
              :href="repoLink"
              class="repo-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <OutboundLink />
            </a>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
import SearchBox from '@SearchBox'

export default {
  name: 'Header',
  components: { SearchBox },
  props: {
    showIcon: {
      type: Boolean,
      default: false,
    },
    restaurants: {
      type: Array,
      default () {
        return []
      },
    },
  },
  data () {
    return {
      headerLeft: 260,
      searchVal: '',
      hasShadow: false,
      queryStrlen: 1,
      hasResults: true,
    }
  },
  computed: {
    repoLink () {
      const { repo } = this.$site.themeConfig
      if (repo) {
        return /^https?:/.test(repo)
          ? repo
          : `https://github.com/${repo}`
      }

      return ''
    },
    placeholder () {
      return this.$themeConfig.placeholder || ''
    },
    searchReply () {
      return (
        this.$themeConfig.searchReply ||
                '什么都没搜到，试一下其它搜索词~'
      )
    },
    iconName () {
      if (typeof window === 'undefined') return 'icon-caidan'
      if (document.body.clientWidth <= 1200) {
        return this.showIcon ? 'icon-guanbi' : 'icon-caidan'
      }
      return this.showIcon ? 'icon-caidan' : 'icon-guanbi'
    },
  },
  mounted () {
    this.bindScrl()
  },
  activated () {
    this.bindScrl()
  },
  methods: {
    clickMenu () {
      this.$emit('clickMenu')
      if (typeof window === 'undefined') return
      if (document.body.clientWidth <= 1200) {
        return
      }
      if (this.headerLeft === 65) {
        this.headerLeft = 260
      } else {
        this.headerLeft = 65
      }
    },
    querySearch (queryString, cb) {
      this.hasResults = true
      this.queryStrlen = queryString.length
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      if (results.length === 0) {
        this.hasResults = false
        results.push({
          title: this.searchReply,
          has: false,
        })
      }
      cb(results)
    },
    createFilter (queryString) {
      return restaurant => {
        let searchIndex = restaurant.strippedContent
          .toLowerCase()
          .indexOf(queryString.toLowerCase())

        if (searchIndex > -1) {
          restaurant.searchIndex = searchIndex
          return true
        } else {
          return false
        }
      }
    },
    handleSelect (item) {
      if (item.title === this.searchReply) return
      this.$router.push(item.path)
    },
    getScrollTop () {
      var scrollPos
      if (typeof window === 'undefined') return
      if (window.pageYOffset) {
        scrollPos = window.pageYOffset
      } else if (
        document.compatMode &&
                document.compatMode !== 'BackCompat'
      ) {
        scrollPos = document.documentElement.scrollTop
      } else if (document.body) {
        scrollPos = document.body.scrollTop
      }
      return scrollPos
    },
    bindScrl () {
      const _this = this
      let topScroll = _this.getScrollTop()
      if (topScroll > 190) {
        this.hasShadow = true
      } else {
        this.hasShadow = false
      }
      window.onscroll = function () {
        let topScroll = _this.getScrollTop()
        if (topScroll > 190) {
          _this.hasShadow = true
        } else {
          _this.hasShadow = false
        }
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.header-warp {
    width: 100%;
    height: 100%;
}

.headerShadow {
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2),
        0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
}

.top-header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    color: #fff;
    background: #3f51b5;
    padding-left: 260px;
    transition: padding-left 0.2s ease-in-out, background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s linear;
    z-index: 30;
    height: 56px !important;
    padding-top: 3px;

    .repo-link {
      color: #fff;
    }
}

@media (max-width: 1200px) {
    #topHeader {
        padding-left: 0 !important;
    }
}

@media (max-width: 719px) {
    .repo-link {
        display none
    }
}
</style>
