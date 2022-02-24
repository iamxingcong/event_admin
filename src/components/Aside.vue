<template>
  <el-col :span="24">
    <div class="logo" @click="goto('/')">
       
      <img :src="xpic" />
      <span class="logotitle">  事件系统 </span>
    </div>

    <el-menu
      :default-active="activeIndex"
      :collapse="this.$store.state.menuCollapse"
      router
      unique-opened
      background-color="rgb(48, 65, 86)"
      text-color="#fff"
      active-text-color="rgb(64, 158, 255)"
      @select="handleSelect"
      @open="handleOpen"
      @close="handleClose"
      class="el-menu-vertical-demo"
    >
      <el-menu-item index="/dash">
        <i class="el-icon-setting"></i>
        <span slot="title"> Dashboard </span>
      </el-menu-item>

      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-odometer"></i>
          <span> 自动化工具 </span>
        </template>

        <el-menu-item index="strategy"> 策略管理 </el-menu-item>
        <el-menu-item index="event"> 事件列表 </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-col>
</template>

<script>
import {pic} from '@/assets/pic.json'
export default {
  data() {
    return {
      logo: require("@/assets/logo.png"),
      activeIndex: this.$route.path.replace("/", ""),
      menuCollapse: this.$store.state.menuCollapse,
      xpic: pic,
      
    };
  },
  created() {
   
    // console.log(this.$route.path);
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(key);
      if (keyPath[1]) {
        console.log(keyPath[1]);
        this.activeIndex = keyPath[1];
      } else {
        console.log(keyPath);
      }
    },
    goto(v) {
      this.$router.push(v);
    },
  },
};
</script>
<style scoped>
.logo {
  width: 100%;
  height: 70px;
  cursor: pointer;
  display: block;
  clear: both;
  text-align: center;
  overflow: hidden;
}
.logotitle{
  line-height: 70px;
  height: 70px;
  display: block;
  float: left;
  color: #fff;
  padding-left: 25px;
  font-size: 18px;
  font-weight: 600;
}

.logo img {
    margin-top: 20px;
    width: 30px;
    height: 30px;
    border: none;
    cursor: pointer;
    float: left;
    padding-left: 20px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu-item i,
.el-submenu__title i{
  color: #fff;
}
</style>