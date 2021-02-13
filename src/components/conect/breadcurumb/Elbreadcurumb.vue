<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/welcome' }" @click.native="cancelStatus"
      >首页</el-breadcrumb-item
    >
    <el-breadcrumb-item v-for="(item, index) in titles" :key="index">
      {{ item }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "El_breadcurumb",
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    cancelStatus() {
      // 首页按钮被点击 发送取消链接状态保存事件
      this.$bus.$emit("cancelStatus");
    },
  },
};
</script>

<style lang="less" scoped></style>
