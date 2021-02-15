<template>
  <div>
    <!-- 面包屑导航区域 -->
    <elbreadcurumb :titles="['权限管理', '权限列表']" />

    <!-- 卡片视图 -->
    <roles-list :rolesList="rolesList"></roles-list>
  </div>
</template>

<script>
import Elbreadcurumb from "components/conect/breadcurumb/Elbreadcurumb";

import { getUserList } from "network/home.js";

import RolesList from "./children/RolesList";
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
    };
  },
  components: {
    Elbreadcurumb,
    RolesList,
  },
  created() {
    // 获取角色列表数据
    this.getRolesList();
    // 监听事件总线发起的更新数据事件
    this.$bus.$on("updateData", this.getRolesList);
  },
  methods: {
    // 获取展示数据方法
    getRolesList() {
      getUserList({ url: "/roles" }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("角色列表信息获取失败");
        }
        this.rolesList = res.data.data;
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
