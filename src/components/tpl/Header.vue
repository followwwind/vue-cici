<template>
  <el-col :span="24" class="header">
    <el-col :span="10" class="logo" :class="sidebar.opened?'logo-width':'logo-collapse-width'" @click.native.prevent="index" style="cursor:pointer;">
      <!-- {{sidebar.opened?sysName:''}} -->
    </el-col>
    <el-col :span="10">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" style="background: #20a0ff;color:white;">
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">知识点</el-menu-item>
        <el-menu-item index="3">问答</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="4" class="userinfo" v-show="!user">
      <span @click="toLogin()" style="cursor:pointer;">登录</span>
      <span @click="toReg()" style="cursor:pointer;">注册</span>
    </el-col>
    <el-col :span="4" class="userinfo" v-show="user">
      <el-dropdown trigger="hover">
        <span class="el-dropdown-link userinfo-inner"><img :src="user && user.img ? user.img : defaultImg" /> 
          {{user? user.username : 'Wind'}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="order">我的预定</el-dropdown-item>
          <el-dropdown-item @click.native="set">设置</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>

    <!--新增编辑界面-->
		<el-dialog :title = "isAdd?'登录':'注册'" :visible.sync = "formVisible" :close-on-click-modal = "false">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <!-- <h3 class="title">系统{{isAdd?'登录':'注册'}}</h3> -->
      <el-form-item prop="username">
        <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <!-- <a href="javascript:void(0)" class="right" @click="register"><span>没有账号?去注册</span></a> -->
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="login" :loading="logining">{{isAdd?'登录':'注册'}}</el-button>
        <!--<el-button @click.native.prevent="reset">重置</el-button>-->
      </el-form-item>
    </el-form>
		</el-dialog>
  </el-col>
</template>

<script>
import { mapGetters } from 'vuex'
import {removeFrontUser, getFrontUser, setFrontUser} from '@/utils/store';
import {login, reg} from '@/api/user';
export default {
  name: 'Header',
  data() {
    return {
      activeIndex: '1',
      sysName: 'VUEADMIN',
      collapsed: false,
      user: getFrontUser(),
      defaultImg: require("../../assets/head.png"),
      logining: false,
      ruleForm: {
        username: '',
        password: '',
        type: 1
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
      checked: true,
      isAdd: true,
      formVisible: false
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
        removeFrontUser();
        this.user = null;
        _this.$router.push('/app/index');
      }).catch(() => {

      });
    },
    toLogin: function(){
        this.formVisible = true;
        this.isAdd = true;
    },
    toReg: function(){
        this.formVisible = true;
        this.isAdd = false;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    login: function(){
      if(this.isAdd){
        login(this.ruleForm).then(res => {
              this.$message({message: '登录成功',type: 'success'});
              setFrontUser(res);
              this.user = res;
              this.formVisible = false;
        })
      }else{
        reg(this.ruleForm).then(res => {
            this.$message({message: '注册成功',type: 'success'});
            this.formVisible = false;
        })
      }
    },
    set: function(){
      this.$router.push('/app/setting');
    },
    order: function(){
      this.$router.push('/app/order');
    },
    index: function(){
      this.$router.push('/app/index');
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
    border-right-width: 0px;
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
