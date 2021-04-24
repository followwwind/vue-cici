<template>
  <aside :class="sidebar.opened? 'unfold':'collapse'">
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" 
    @select="handleSelect" :collapse="!sidebar.opened">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">Navication</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/admin/user">用户列表</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/admin/userPermission">管理员权限</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/admin/learn">学习区管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/admin/category">知识点标签</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/admin/knowledge">知识点管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/admin/knowComment">知识点评论管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/admin/question">问答管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/admin/questionComment">问题回答管理</el-menu-item>
        </el-menu-item-group>
        <!-- <el-menu-item-group>
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <span slot="title">选项4</span>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu> -->
      </el-submenu>
      <!-- <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item> -->
    </el-menu>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Aside',
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  data() {
    return {
      
    }
  },
  methods: {
    handleOpen() {
      //console.log('handleOpen');
    },
    handleClose() {
      //console.log('handleClose');
    },
    handleSelect: function (index, arr) {
      // console.log(a, b);
      this.$router.push({ path: index });
    }
  }
}
</script>

<style scoped lang="scss">
aside {
  flex:0 0 230px;
  // width: 230px;
  // position: absolute;
  // top: 0px;
  // bottom: 0px;
  .el-menu{
    height: 100%;
  }
}

.unfold{
    width: 230px;
    flex: 0 0 230px;
}

.collapse{
    width: 64px;
    flex: 0 0 64px;
}

</style>
