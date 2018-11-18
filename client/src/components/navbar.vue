<template>
  <div>
     
   
</div>
</template>

<script>
  export default {
  props: ['tokenexist'],
  data(){
    return{
      isLogin : localStorage.getItem('token'),
      username: localStorage.getItem('username')
    }    
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('userId')
      this.isLogin = false
    }
  }
  }
</script>

<style>
 
</style>