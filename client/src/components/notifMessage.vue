<template>
  <div>

    <div class="alert alert-success" role="alert" v-if='showmsg'>
      {{ msg }}
    </div>
    <div class="alert alert-danger" role="alert" v-if='showerr'>
      {{ msg }}
    </div>

  </div>  
</template>

<script>
export default {
  props: ['showmsg', 'showerr', 'msg']
  ,methods: {
    clearNotif() {
      setTimeout(()=>{
        this.showmsg = false
        this.showerr = false
      }, 2500)
    }
  },
  watch: {
    showmsg(val) {
      if(val) {
        this.clearNotif()
      }
    },
    showerr(val) {
      if(val) {
        this.clearNotif()
      }
    }
  }
}
</script>

<style scoped>

</style>
