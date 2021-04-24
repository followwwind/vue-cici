<template>
  <div class="login-bg">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <!-- <el-form-item >
				<el-select v-model="ruleForm.type" placeholder="请选择登录类型" auto-complete="off">
					<el-option label="用户" value="1"></el-option>
					<el-option label="酒店用户" value="2"></el-option>
          <el-option label="管理员" value="3"></el-option>
				</el-select>
			</el-form-item> -->
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <a href="javascript:void(0)" class="right" @click="register"><span>没有账号?去注册</span></a>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="login" :loading="logining">登录</el-button>
        <!--<el-button @click.native.prevent="reset">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {setUser} from '@/utils/store';
import {login} from '@/api/common';
export default {
  name: 'Login',
  data() {
    return {
      logining: false,
      ruleForm: {
        username: '',
        password: '',
        type: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
      checked: true
    };
  },
  methods: {
    reset() {
      this.$refs.ruleForm.resetFields();
    },
    login(ev) {
      var _this = this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //_this.$router.replace('/table');
          this.logining = true;
          //NProgress.start();
          var loginParams = { username: this.ruleForm.username, password: this.ruleForm.password };
          login(this.ruleForm).then(res => {
              this.$message({message: '登录成功',type: 'success'});
              setUser(res);
              if(res.type == 1){
                  this.$router.push({ path: '/admin' });
              }else if(res.type == 2){
                  this.$router.push({ path: '/hotel' });
              }else{
                  this.$router.push({ path: '/app' });
              }
          })
        } else {
          return false;
        }
      });
    },
    register(){
      this.$router.push({ path: '/register' });
    }
  }
}

</script>

<style lang="scss" scoped>
.login-bg {
  position: absolute;
  margin-top: 0px;
  height: 100%;
  width: 100%;
  background: url('../assets/bg.jpg') !important;
  background-repeat: no-repeat; 
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  .login-container {
    position: relative;
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
    .right {
      position: relative;
      margin-left: 155px;
      text-align: right;
    }
  }
}
</style>