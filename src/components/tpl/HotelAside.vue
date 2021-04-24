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
          <el-menu-item index="/hotel/room">房间管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/hotel/order">住房订单管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/hotel/menuOrder">订餐订单管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/hotel/comment">评论管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/hotel/menu">菜单管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/hotel/money">收入统计</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/hotel/setting">酒店管理</el-menu-item>
        </el-menu-item-group>
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
