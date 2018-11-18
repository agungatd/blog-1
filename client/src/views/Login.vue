<template>
  <div>
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" v-model='email'>
        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model='password'>
      </div>
      <h6>Does not have an account yet?&nbsp;<span id='register'data-toggle="modal" data-target="#registerModal">Register</span></h6>
        <div class="alert alert-success" role="alert" v-if='success'>
          yes {{ msg }}
        </div>
        <div class="alert alert-danger" role="alert" v-if='error'>
          No {{ msg }}
        </div>
      <button type="submit" class="btn btn-primary" @click='login'>Login</button>
      <!-- MODAL - Registration -->
      <div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Register Here:</h5>
              
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="exampleInputUsername1">Username</label>
                <input type="text" class="form-control" id="exampleInputUsername1" placeholder="Enter Username" v-model='username'>
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Enter email" v-model='email'>
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword2" placeholder="Password" v-model='password'>
              </div>
            </div>
            <div class="alert alert-success" role="alert" v-if='success'>
              {{ msg }}
            </div>
            <div class="alert alert-danger" role="alert" v-if='error'>
              {{ msg }}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click='register'>Sign Up</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script> 
import axios from 'axios'
export default {
  props: ['token', 'hasLoggedIn'],
  data() {
    return {
      username: '',
      email: '',
      password: '',
      msg: '',
      success: false,
      error: false
    }
  },
  mounted() {
  },
  methods: {
    neutralize(){
      this.msg = '',
      this.error = false,
      this.success = false
    },
    register() {
      let self = this
      // this.$serverUser.post('/register', {
      axios.post(`${this.$server}/users/register`, {
        username: self.username,
        email: self.email,
        password: self.password
      })
      .then((result) => {
        
        self.success = true
        self.error = false
        self.msg = 'Successfully registered!'
      }).catch((err) => {
        
        self.success = false
        self.error = true
        self.msg = err.response.data.message || err
      });
      this.clearState()
    },
    login() {
      console.log(this.email, this.password)
      this.neutralize()
      let self = this
      axios.post(`${this.$server}/users/login`, {
        email: self.email,
        password: self.password
      })
      .then((result) => {
        console.log('masuk then', result)
        // if(result.data===false) {
        //   self.success = false
        //   self.error = true
        //   self.msg = 'formnya!!'
        // } else {
          self.success = true
          self.error = false
          self.msg = 'Successfully Log in!'
          localStorage.setItem('token',result.data.token)
          localStorage.setItem('userId',result.data.userId)
          localStorage.setItem('username', result.data.username)
          self.hasLoggedIn()
        //   // console.log(self.hasLoggedIn())
        // }
      })
      .catch((err) => {
        console.log('masuk catch', err.response)
        self.success = false
        self.error = true
        if(!err.response.data.message) {
          self.msg = 'Please fill in the form!'
        } else {
          self.msg = err.response.data.message || err
        }
      });
      this.clearState()
    },
    clearState() {
      this.username= '',
      this.email= '',
      this.password= ''
      this.success = false
      this.error = false
    }

  }
  
}
</script>

<style >
  #register {
    color:blue;
  }
  h6 #register:hover {
    color: slateblue;
    background-color: wheat;
    cursor: pointer;
  }
</style>
