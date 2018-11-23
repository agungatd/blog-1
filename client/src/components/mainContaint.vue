<template>
  <div class='main-content'>
  <br>
    <h3>{{ article.title }}</h3>
    <h6>by {{ article.author.username }}</h6>
    <hr>
      <p>Posted on {{ getDate(article.createdAt) }}</p>
    <div>
      <img id='image' :src=" article.image " alt="">
    </div>
    <hr>
    <!-- <button class="btn btn-secondary" @click="textToSpeech">Text to Speech</button> -->
    <div class='paragraf' id="paragraf" v-html="article.content" >
    </div>
    <h4>Related Videos:</h4>
    <div class="row">
      <videos-comp :videos='videos' />
    </div>
    <div v-if='activeId === article.author._id'><br><br>
      <button class='btn-sm btn-primary' data-toggle="modal" data-target="#editModal"><i class="fa fa-edit"></i> Edit Article</button> &nbsp; 
      <button class='btn-sm btn-danger' data-toggle="modal" data-target="#deleteModal"><i class="fa fa-trash"></i> Delete Article</button>
    </div>
    <hr>
    <div class="row">
      <div class="col-md-3">
        <img src="">
      </div>
      <div class="col-md-8">
        <notif :showmsg='showMsg' :showerr='showErr' :msg='msg' /> 
        <button class="btn btn-primary" v-if="activeId !== article.author._id" @click="subscribe(article.author._id)">Subscribe to Author</button>
      </div>
    </div>
    <hr>
    <div class='row' id='icons'>
      <div class='col-sm-4'>
        <span style='color: red;'><i class="fa fa-heart"></i> Like &nbsp;&nbsp;</span>
        <span  style='color: darkblue;'><i class="fa fa-thumbs-down" aria-hidden="true"></i> Hate</span>
          <span></span>
      </div>
      <div class='col-sm-4'>
        <span style='color: blue;' @click='showShare'><i class="fa fa-share-alt" aria-hidden="true"></i> Share</span> 
      </div>
      <div class='col-sm-4'>
        <span style='color: brown;' @click='showCommentsForm(article._id)'><i class="fa fa-comments" aria-hidden="true"></i> Add Comment &nbsp;&nbsp;</span>
        <span style='color: rebeccapurple;' @click='showGlobalChats'><i class="fa fa-comments-o" aria-hidden="true"></i> Live Chat</span>
      </div>
    </div>
    <share v-if='shareOpen' :article='article' ></share><!--:user='article.author.username'-->
    <div v-if='showGlobalChat'>
      <input class='form-control' type='text' placeholder='Enter the message here...' v-model='messageChat' @keyup.enter='submitChat' />
      <div class="liveChat" v-for="(chat,index) in listChat" :key='index'>
        <span>{{ chat.name }}:</span> <p>{{ chat.message }}</p>
      </div>
    </div>

    <comments 
      :isLogin='isLogin' 
      :showComments='showComments' 
      :article='article' 
      :getDate='getDate' />

    <!-- MODAL EDIT -->
      <div class="modal fade " id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Edit your article Here:</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="image">Insert Article Image:</label>
                  <input class="form-control" type="file" name="image" id="">
                  or copy the url image from the internet:
                  <input class="form-control form-control-lg rounded-0" name="image_url" required="" v-model='article.image'>
                </div>
                <div class="form-group">
                  <label for="title">Insert Article Title:</label>
                  <input class="form-control" type="text" name="title" id="" placeholder='Input Title here..' v-model='article.title' required>
                </div>
                  <label for="contents">Insert Article Contents:</label>
                    <wysiwyg v-model='article.content'/>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click='editArticle(article._id)' data-dismiss="modal">Edit</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    <!-- / MODAL EDIT -->
    <!-- MODAL Delete -->
      <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteModalLabel">Delete This Article ?</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              {{article.author.username}}, are you sure ?
              Do you really want to delete this article ??
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-warning" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" @click='deleteArticle(article._id)' data-dismiss="modal">Yes, Just Delete It!</button>
            </div>
          </div>
        </div>
      </div>
      <!-- / MODAL Delete -->
  </div>
</template>

<script>
  import comments from '@/components/comments.vue';
  import share from '@/components/share.vue'
  import notif from '@/components/notifMessage.vue'
  import videosComp from '@/components/videos.vue'
  
  // import db from '../assets/config.js'

  export default {
    props: ['isLogin', 'getDate', 'randomArticle'],
    data() {
      return {
        article: this.randomArticle,
        activeId: localStorage.getItem('userId'),
        showGlobalChat: false,
        listChat:'',
        messageChat:'',
        removeList: '',
        comment: '',
        allComments: [],
        shareOpen: false,
        showComments: false,
        showMsg: false,
        showErr: false,
        msg: '',
        videos: [],
        text: 'Error when reading the HTML'
      }
    },
    components: {
      comments, share, notif, videosComp
    },
    methods: {
      getArticle(id) {
        let self = this
        axios.get(`${this.$server}/articles/detail/${id}`)
        .then((result) => {
          self.article = result.data.data[0]
          console.log(self.article)
          this.searchVid(self.article.title)
          this.getContent()
          this.showComments = false
        }).catch((err) => {
          console.log(err)
        });
      },
      editArticle(id) {
        // console.log(id,'--',this.article)
        let self = this
        axios.put(`${this.$server}/articles/${id}`, {
          title: self.article.title,
          content: self.article.content,
          image: self.article.image
        }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((result) => {
          self.getArticle(id)
        }).catch((err) => {
          console.log(err)
        });
      },
      deleteArticle(id) {
        let self = this
        axios.delete(`${this.$server}/articles/${id}`,{
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((result) => {
        console.log('deleted article with id:', id)
          this.$router.push({name:'home'})
          // this.getArticle()
        }).catch((err) => {
          console.log(err)
        });
      },
      submitChat() {
        try {
          db.ref(`/db/globalChat`).push({
            name: localStorage.getItem('username'),
            message: this.messageChat,
          })
        } catch (error) {
          console.log(error)
        }
        this.messageChat = ''
      },
      refreshLobby() {
        db.ref('/db/globalChat').on('value', snapshot => {
          if (snapshot.val()) {
          this.listChat = Object.values(snapshot.val())
              .reverse()
              .slice(0, 9)
              .reverse()
          this.removeList = Object.keys(snapshot.val())
              .reverse()
              .slice(9)
          }
        })
      },
      showGlobalChats() {
        this.showGlobalChat = true
        this.showComments = false
      },
      showCommentsForm(id) {
        this.showGlobalChat = false
        this.showComments = true
        this.showAllComments(id)
      },
      showShare() {
        this.shareOpen = true
      },
      subscribe(authorId) {
        let self = this
        axios.put(`${this.$server}/users/add-follower/${authorId}`, {
          follower: localStorage.getItem('userId')
        }, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }).then((result) => {
          console.log('success in subscribing:', result)
          if(result.data.message) {
            self.msg = result.data.message
            self.showErr = true
          } else {
            self.msg = 'You have become a follower of this author. /n you will get email notification if the author publish new article.'
            self.showErr = false
            self.showMsg = true
          }
        }).catch((err) => {
          console.log('error in subscribing:',err)
        });
      },
      searchVid(query) {
        let self = this
        axios.get(`https://www.googleapis.com/youtube/v3/search`, {
          params: {
            key: 'AIzaSyCvA5gHnQ5mcxX6RkJwcJ5ch5-y2sIHZ8U',
            part: 'snippet',
            q: query,
            maxResults: 3
          }
        })
        .then((result) => {
          let arr = [], arr2=[]
          result.data.items.forEach(item=>{
            item.url = `https://www.youtube.com/watch?v=${item.id.videoId}`
            arr.push(item.snippet)
            arr2.push(item)
          })
          self.videos = arr2
          console.log('success get videos', arr2)
        }).catch((err) => {
          console.log('error when get videos:', err)
        });
      },
      getContent() {
        var element = document.getElementById('paragraf');
        self.text = element.innerText;
        // console.log('text:', text)
      },
      textToSpeech() {
        let self = this
        var element = document.getElementById('paragraf');
        self.text = element.innerText;
        
        axios.post(`${this.$server}/articles/text-to-speech`, {
          text: self.text
        }).then((result) => {
          console.log(result)
        }).catch((err) => {
          console.log(err.response)
        });

      }
    },
    mounted() {
      this.getArticle(this.$route.params.id)
      if(this.article.title) {
        this.searchVid(this.article.title)
      }
      
    },
    created() {
      this.refreshLobby()
      this.showComments = false
    },
    computed: {
      getParamsId: function() {
        return this.$route.params.id
      }
    },
    watch: {
      getParamsId: function(val) {
        this.getArticle(val)
      },
      showMsg(val) {
        if(val) setTimeout(()=>{
          this.showMsg = false
          this.showErr = false
        }, 2500)
      },
      showErr(val) {
        if(val) setTimeout(()=>{
          this.showMsg = false
          this.showErr = false
        }, 2500)
      },
      showComments: function(val) {
        console.log('status showComment-->', val)
      },
      randomArticle(val) {
        if(val) {
          this.article = this.randomArticle
          this.searchVid(self.article.title)
          this.getContent()
        }
      }
    }
  }
</script>

<style >
.main-content {
  background-color: white;
}
#image {
  min-height: 400px;
  width: 100%;
}
.paragraf {
  text-align: justify;
  text-justify: inter-word;
  width: 100%
}
#icons span:hover{
  cursor: pointer;
  background-color: wheat;
}
.commentBox {
  border: 1px solid brown;
  margin: 5px auto;
  min-width:700px;
  background-color: #e6e6fa;
}
.liveChat {
  border: 1px solid cyan;
  min-width:auto;
  background-color: #c6e2ff;
  border-radius: 50px;
}
.liveChat span {
  text-align: left;
}
.liveChat p {
  text-align: center;
}
</style>