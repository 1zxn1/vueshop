<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logoout()">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :style="{width:isshow?'65px':'200px'}">
        <div class="toggle_bar" @click="isshow=!isshow">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :style="{width:isshow?'65px':'200px'}"
          :collapse="isshow"
          :collapse-transition="false"
        >
          <el-submenu :index="k+''" v-for="(item,k) in menuList" :key="item.id">
            <template slot="title">
              <i :class="'iconfont icon-'+iconList[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="item.id+'-'+item2.id"
                v-for="item2 in item.children"
                :key="item2.id"
              >
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
  },
  methods: {
    async getMenuList() {
      const { data: dt } = await this.$http.get('/menus')
      console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.menuList = dt.data
    },
    logoout() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  data() {
    return {
      isshow: false,
      menuList: [],
      iconList: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    padding-right: 20px;
    .logo-box {
      display: flex;
      align-items: center;
      font-size: 22px;
      color: #fff;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      .el-menu-item {
        font-size: 13px;
      }
    }
    .toggle_bar {
      height: 25px;
      line-height: 25px;
      letter-spacing: 0.1em;
      background-color: #4a5064;
      text-align: center;
      color: #fff;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
