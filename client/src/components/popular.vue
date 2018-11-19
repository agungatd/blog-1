<template>
  <div class='pop-bar'>
    <br>
    <h4>Popular Articles:</h4>
    <div class="text py-4" v-for='article in articles' :key="article._id">
      <div class="meta">
        <div><small>{{ getDate(article.date) }}</small></div>
        <div style='color: blue;'>By {{article.author.username}}</div>
      </div>
      <h3 class="heading" style='color: blue;'>{{article.title}}</h3>
      <p v-html='article.content'>...</p>
      <router-link :to="{ path: `/home/${article.id}`}">
        <span id='read' style='color:blue' @click="addViews(article.id, article.views)">Read more</span>
      </router-link>
      <div class='row'>
        <div class='col-sm-4'>
          <i class="fa fa-heart"> Likes</i> {{article.likes.length}} 
        </div>
        <div class='offset col-sm-4'></div>
        <div class='col-sm-4' >
          <i class="fa fa-eye" aria-hidden="true"> Read</i>  {{ article.views }}
        </div>
      </div><hr>
    </div>

  </div>
</template>

<script>
  export default {
    props: ['isLogin', 'getDate'],
    data() {
      return {
        articles: [],
        title: '',
        content: '',
        image: '',
        author: '',
        query: '',
        readCounter: 0,
        mine: false,
        msg: '',
        success: false,
        error: false,
        showComments: false
      }
    },
    methods: {
      getArticles() {
        this.articles = []
        let self = this
        axios.get(`${this.$server}/articles/popular`)
        .then((result) => {
          // console.log('result popular', result.data)
          result.data.forEach(article=>{
            let summary = article.content.slice(0,100)
            let data = {
              id: article._id,
              title : article.title,
              content : summary,
              image : article.image || 'http://3.bp.blogspot.com/-Iw7UP2Mpisw/T1iKZIDTy4I/AAAAAAAAcy0/gVvpFmbNp00/s1600/Stationary+Pen+Pencil+(7).jpg',
              author : article.author,
              likes: article.likes,
              views: article.views,
              date : article.createdAt || new Date
            }
            self.articles.push(data)
          })
          // console.log(self.articles)
        }).catch((err) => {
          console.log(err)
        });
      },
       addViews(id, lastViews) {
        let self = this
        let newViews = lastViews + 1
        console.log('last:',lastViews, 'new:', newViews)
        axios.put(`${this.$server}/articles/add-views/${id}`, {
          views: newViews
        }).then((result) => {
          console.log(result)
          self.getArticles()
        }).catch((err) => {
          console.log('error when adding views:', err.response)
        });
      }
      
    },
    watch: {
      readCounter(val) {
        console.log('readcount---', val)
      }
    },
    computed: {
      
    },
    created() {
      this.getArticles()
    },
  }
</script>

<style scoped>
  .pop-bar {
    background: wheat;
  }
  .side-bar {
    background-color: whitesmoke;
  }
  #read:hover{
    color: slateblue;
    background-color: whitesmoke;
    cursor: pointer;
  }
</style>