<template>
  <div
    v-if="showTags"
    class="tag-content"
  >
    <el-row
      type="flex"
      align="center"
      justify="center"
    >
      <el-col
        :span="20"
        :xs="{span:23}"
        :sm="{span:22}"
        :md="{span:22}"
        :lg="{span:20}"
        class="tag-card"
      >
        <el-tag
          v-for="tag in tagsList"
          :key="tag[0].name"
          size="medium"
          :hit="true"
          @click="whatTag"
        >
          {{ tag[0].name }}
        </el-tag>
      </el-col>
    </el-row>
    <div
      v-if="hasTagsList.length"
      class="tag-warp"
    >
      <el-row
        type="flex"
        align="center"
        justify="center"
        class="post-list"
      >
        <el-col
          v-for="post in hasTagsList"
          :key="post.title"
          :span="10"
          :xs="{span:23}"
          :sm="{span:11}"
          :md="{span:11}"
          :lg="{span:10}"
          class="list"
        >
          <el-card>
            <div class="post-title-time ellipsis">
              {{ post.lastUpdated }}
            </div>
            <router-link
              :to="post.path"
              class="post-title-link"
            >
              {{ post.title }}
            </router-link>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tags',
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
      tagName: '',
      tagsList: {},
      showTags: false,
    }
  },
  computed: {
    hasTagsList () {
      if (!this.tagsList[this.tagName]) {
        return []
      }
      return this.tagsList[this.tagName].slice(1)
    },
  },
  watch: {
    $route (to) {
      if (to.params.tag) {
        this.tagName = to.params.tag
        if (typeof window === 'undefined') return
        document.getElementById('conentHeader').innerText = to.params.tag
      }
    },
  },
  created () {
    this.checkRouter()
    import(/* webpackChunkName: "tagsList" */ 'imData/tagsList.js').then(
      tagsList => {
        this.showTags = true
        this.tagsList = tagsList.default
      }
    )
  },
  methods: {
    whatTag (e) {
      this.tagName = e.target.innerText
      if (typeof window === 'undefined') return
      document.getElementById('conentHeader').innerText = e.target.innerText
    },
    checkRouter () {
      if (this.$route.params.tag) {
        this.tagName = this.$route.params.tag
        if (typeof window === 'undefined') return
        document.getElementById(
          'conentHeader'
        ).innerText = this.$route.params.tag
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.post-title-time {
    font-weight: 500;
    font-size: 15px;
    color: #727272;
    margin: 10px 10px 0;
}
.post-title-link {
    color: #3f51b5;
    font-size: 19px;
    padding: 0 10px 10px;
    display: flex;
}
.tag-content {
    margin-top: -38px;
    padding-bottom: 30px;
}

.tag-card {
    padding: 20px;
    background: #fff;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-content: center;
    border-radius: 4px;
    box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2),
        0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12);
}

.post-list {
    flex-wrap: wrap;
    justify-content: space-evenly;
}
.list {
    margin: 15px 0;
    &:first-child,
    &:nth-child(2) {
        margin-top: 30px;
    }
}
</style>
