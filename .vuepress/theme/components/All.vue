<template>
  <div
    v-if="showPoList"
    class="all-warp"
  >
    <div
      v-for="(item,index) in poList"
      :key="index"
    >
      <h3>{{ item[0] }}</h3>
      <el-row
        type="flex"
        justify="center"
        align="middle"
        class="post-warp"
      >
        <el-col
          v-for="post in item.slice(1)"
          :key="post.title"
          :span="20"
          :xs="{span:23}"
          :sm="{span:23}"
          :md="{span:23}"
          :lg="{span:20}"
          class="post"
        >
          <el-card class="box-card">
            <div slot="header">
              <p class="post-title-time">
                {{ post.lastUpdated }}
              </p>
              <router-link
                :to="post.path"
                class="post-title-link"
              >
                {{ post.title }}
              </router-link>
            </div>
            <div v-if="(post.excerpt || post.tags.length)">
              <div v-if="post.excerpt">
                <div class="post-excerpt">
                  {{ post.excerpt }}
                </div>
              </div>
              <div
                v-if="post.tags.length"
                class="post-footer"
              >
                <el-tag
                  v-for="tag in post.tags"
                  :key="tag"
                  size="medium"
                  :hit="true"
                  @click="toTaglist"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'All',
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
      poList: [],
      showTags: false,
      showPoList: false,
    }
  },
  created () {
    import(/* webpackChunkName: "poList" */ 'imData/poList.js').then(
      poList => {
        this.showPoList = true
        this.poList = poList.default
      }
    )
  },
  methods: {
    toTaglist (e) {
      this.$router.push('/tags/' + e.target.innerText)
    },
  },
}
</script>

<style lang="stylus" scoped>
.all-warp {
    margin-top: 15px;

    h3 {
        color: #3f51b5;
        font-size: 20px;
        text-align: center;
    }
}

.post-warp {
    flex-wrap: wrap;
    justify-content: space-evenly;
}

.post {
    margin: 10px;
}
</style>
