<template>
  <div>
    <div class='comments' v-if='showComments'>
      <h3>User Comments:</h3>
      <hr>
      <textarea style='min-height:100px; min-width:700px' placeholder='Enter your comment here...' v-model='comment' /><br>
      <button @click='submitComment(article._id)'>Submit Comment</button>
      <button @click='showCommentsForm(article._id)'>Refresh Comment</button>
      <div v-for='comment in allComments' :key='comment._id' class='commentBox'>
        <div>posted on: {{ getDate(comment.createdAt) }}</div>
        <div style='text-align:left; padding-left:5px;'>{{ comment.commentator.username }} commented:</div>
        <div style='text-align:right ; padding-right:5px;'>{{ comment.message }}</div>
      </div>
    </div>  
   
  </div>
</template>

<script>
  export default {
  props: ['isLogin', 'showComments', 'article', 'getDate'],
  data(){
    return{
      isLogin : localStorage.getItem('token'),
      username: localStorage.getItem('username'),
      comment: '',
      allComments: []
    }    
  },
  watch: {
    showComments(val) {
      if(val) {
        this.showAllComments(this.article._id)
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('userId')
      this.isLogin = false
    },
    showAllComments(id) {
      self = this
      axios.get(`${this.$server}/comments/${id}`)
      .then((result) => {
        self.allComments = result.data.data
      }).catch((err) => {
        console.log(err)
      });
    },
    submitComment(id) {
      console.log('post comment:', this.comment, id)
      let self = this
      axios.post(`${this.$server}/comments/${id}`, {
        commentator: localStorage.getItem('userId'),
        message: self.comment,
        article: id
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((result) => {
        // console.log('hasil dari submit comment--',result.data)
        self.showAllComments(id)
        self.comment = ''
      }).catch((err) => {
        console.log(err)
      });
    },
  }
  }
</script>

<style>
 
</style>