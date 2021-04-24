<template>
  <el-col :span="24" class="header">
    <!-- <el-col :span="10" class="logo" :class="sidebar.opened?'logo-width':'logo-collapse-width'">
      {{sidebar.opened?sysName:''}}
    </el-col> -->
    <el-col :span="10">
      <div class="tools" @click.prevent="collapse">
        <i class="fa fa-align-justify"></i>
      </div>
    </el-col>
    <el-col :span="4" class="userinfo">
      <el-dropdown trigger="hover">
        <span class="el-dropdown-link userinfo-inner"><img :src="user && user.img ? user.img : defaultImg" /> 
          {{user? user.username : 'Wind'}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="info">个人信息</el-dropdown-item>
          <!-- <el-dropdown-item @click.native="set">设置</el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-col>
</template>

<script>
import { mapGetters } from 'vuex'
import {removeUser, getUser} from '@/utils/store';
export default {
  name: 'Header',
  data() {
    return {
      sysName: 'VUEADMIN',
      collapsed: false,
      user: getUser(),
      defaultImg: require("../../assets/head.png")
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    //退出登录
    logout: function () {
      var _this = this;
      this.$confirm('确认退出吗?', '提示', {
        //type: 'warning'
      }).then(() => {
        removeUser();
        _this.$router.push('/login');
      }).catch(() => {

      });
    },
    info: function(){
      this.$router.push('/hotel/info');
    },
    //折叠导航栏
    collapse: function(){
      this.$store.dispatch('ToggleSideBar')
    }
  },
  mounted() {

  }
}
</script>

<style scoped lang="scss">
.header {
  height: 60px;
  line-height: 60px;
  background: #20a0ff;
  color:#fff;
  .userinfo {
    text-align: right;
    padding-right: 35px;
    float: right;
    .userinfo-inner {
      cursor: pointer;
      color:#fff;
      img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin: 10px 0px 10px 10px;
        float: right;
      }
    }
  }
  .logo {
    //width:230px;
    height:60px;
    font-size: 22px;
    padding-left:20px;
    padding-right:20px;
    border-color: rgba(238,241,146,0.3);
    border-right-width: 1px;
    border-right-style: solid;
    img {
      width: 40px;
      float: left;
      margin: 10px 10px 10px 18px;
    }
    .txt {
      color:#fff;
    }
  }
  .logo-width{
    width: 230px;
  }
  .logo-collapse-width{
    width: 64px
  }
  .tools{
    padding: 0px 23px;
    width:14px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
  }
}
</style>
