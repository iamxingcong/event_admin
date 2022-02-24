<template>
  <el-container
    :class="`${$store.state.menuCollapse ? 'collapsed' : 'uncollapsed'}`"
  >
    <div class="sidebar-container">
      <Aside />
    </div>
    <div class="main-container">
      <el-header>
        <i
          class="el-icon-s-unfold"
          v-if="$store.state.menuCollapse"
          @click="collapse($store.state.menuCollapse)"
        ></i>
        
        <i
          class="el-icon-s-fold"
          v-else
          @click="collapse($store.state.menuCollapse)"
        ></i>

        <span class="tags-view-item">
          首页 / {{$route.meta.title}}
        </span>
        <i class="el-icon-full-screen" @click="fullscreentoggle()"></i>
      </el-header>
      
      <el-main>
        <router-view />
      </el-main>
    </div>
  </el-container>
</template>

<script>
import Aside from "@/components/Aside.vue";
export default {
  name: "Home",
  components: {
    Aside,
  },
  data() {
    return {
      fullscreen: false
    }
  },
  methods: {
    collapse(ls) {
      if (ls) {
        this.$store.commit("change", false);
      } else {
        this.$store.commit("change", true);
      }
    },
    fullscreentoggle(){
       let element = document.documentElement;
    if (this.fullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen();
      }
    }
    this.fullscreen = !this.fullscreen;
        
    }
  },
};
</script>
