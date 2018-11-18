<template>
  <div>
     <div class="alert alert-success" role="alert" v-if='success'>
        {{ msg }}
      </div>
      <div class="alert alert-danger" role="alert" v-if='error'>
        {{ msg }}
      </div>
    <div class="form-group">
     <label for="image">Insert Article Image:</label>
      <input class="form-control" type="file" name="image" id="" @change='uploadImage'>
      or copy the url image from the internet:
      <input v-model="image" class="form-control form-control-lg rounded-0" name="image_url" required="" placeholder="url image">
    </div>
    <div class="form-group">
      <label for="title">Insert Article Title:</label>
      <input class="form-control" type="text" name="title" id="" placeholder='Input Title here..' v-model='title' required>
    </div>
      <label for="content">Insert Article Content:</label>
        <wysiwyg v-model='content'/>
       <!-- <textarea class="form-control" id="exampleFormControlTextarea1" name='content' rows="5" v-model='content'></textarea>-->
      
      <button @click='createArticle'>Save Article</button>
    
  </div>
</template>

<script>
import firebase from '../assets/config.js'
export default {
  props: ['isLogin'],
  name: 'createArticle',
  data () {
    return {
      title: '',
      content: '',
      image: '',
      msg: '',
      success: false,
      error: false,
      uploadFile: null
    }
  },
  methods: {
    neutralize(){
      this.msg = '',
      this.error = false,
      this.success = false
    },
     clearState() {
      this.title= '',
      this.content= '',
      this.image= ''
    },
    createArticle() {
      this.neutralize()
      let self = this
      let token = localStorage.getItem('token')
      let userId = localStorage.getItem('userId')
      let data = {
        author: userId,
        title: self.title,
        content: self.content,
        image: self.image
      }
      if(this.selectedFile) {
        this.onUpload(this.selectedFile)
      } else {
        axios.post(`${this.$server}/articles`, data, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((result) => {
          // console.log(result)
          self.success = true,
          self.msg = 'Success created new Article'
          this.clearState()
        }).catch((err) => {
          // console.log('ERROR:', err)
          self.error = true
          self.msg = err.response.data.message || 'internal server error!'
        });
      }
      
    },
    uploadImage(event) {
      let self = this
      let storage = firebase.storage()

      this.uploadFile = event.target.files[0]
      let file = event.target.files[0]
      // console.log(this.uploadFile);
      let storageRef = storage.ref('image/' + file.name)

      // upload file
      var task = storageRef.put(file)

      // monitor upload
      task.on('state_changed',
        function progress(snapshot) {
          var percentage = snapshot.bytesTransferred / snapshot.totalBytes
        },
        function error(err) {
          console.log(err)
        },
        function complete() {
          console.log('upload complete')
          self.downloadImageUrl(storage)
        }
      )
    },
    downloadImageUrl(storage) {
      let self = this
      this.image = ''
      var imgRef = storage.ref('image/' + this.uploadFile.name)
      imgRef.getDownloadURL()
        .then((result) => {
          console.log('url donwload:', result)
          self.image = result
        }).catch((err) => {
          console.log(err)
        });
    },
  }
}
</script>

<style >
  
</style>