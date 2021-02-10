<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~assets/images/home_logo.jpg" alt="" />
        <span>电商管理平台</span>
      </div>

      <el-button type="info" @click="logoutBtn">
        退出
      </el-button>
    </el-header>

    <!-- 内容主体 -->
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠或者展开按钮 -->
        <div class="toggle-button" @click="collapseClick">| | |</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ff8400"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="(item, index) in menuList"
            :key="index"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="firstMenuIcon[index]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右主体 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getHomeData } from "network/home.js";

export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      // 一级图标i
      firstMenuIcon: [
        "iconfont icon-yonghu",
        "iconfont icon-quanxianguanli",
        "iconfont icon-banjieshiwu",
        "iconfont icon-dingdanguanli",
        "iconfont icon-shujutongji",
      ],
      // 控制是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
    // 监听事件总线发起的首页被点击取消被保存激活链接的状态事件
    this.$bus.$on("cancelStatus", this.cancelStatus);
  },
  mounted() {},
  methods: {
    // 退出登录
    logoutBtn() {
      // 清空token
      window.sessionStorage.clear();
      // 重定向至登录页面
      this.$router.push("/login");
    },

    // 获取左侧列表数据
    getMenuList() {
      getHomeData().then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg);
        }
        this.menuList = res.data.data;
      });
    },

    // 点击折叠
    collapseClick() {
      this.isCollapse = !this.isCollapse;
    },

    // 保存激活链接的状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },

    // 取消被保存激活链接的状态
    cancelStatus() {
      this.activePath = null;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 40px;
      // border: 1px solid #fff;
      border-radius: 50%;
      margin-left: 10px;
    }
    span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
  font-size: 24px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
</style>
