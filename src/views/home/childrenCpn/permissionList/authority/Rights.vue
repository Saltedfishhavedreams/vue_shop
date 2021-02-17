<template>
  <div>
    <!-- 面包屑导航区域 -->
    <elbreadcurumb :titles="['权限管理', '权限列表']" />

    <!-- 卡片视图 -->
    <el-card>
      <rights-list :rightsList="rightsList"></rights-list>
    </el-card>
  </div>
</template>

<script>
import Elbreadcurumb from "components/conect/breadcurumb/Elbreadcurumb.vue";

import RightsList from "./children/RightsList";

import { getUserList } from "network/home.js";
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  components: {
    Elbreadcurumb,
    RightsList,
  },
  created() {
    // 获取权限列表展示数据
    this.getRightsList();
  },
  methods: {
    // 获取权限列表数据
    getRightsList() {
      getUserList({
        url: "/rights/list",
      })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("数据请求失败");
          }
          this.rightsList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
