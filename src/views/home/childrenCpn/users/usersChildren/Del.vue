<template> </template>
<script>
import { getUserList } from "network/home.js";

export default {
  methods: {
    delUser(id = null) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 确定删除按钮点击的处理
          getUserList({
            url: "/users/" + id,
            method: "delete",
          })
            .then((res) => {
              if (res.data.meta.status !== 200) {
                return this.$message.error("删除失败");
              }
              this.$message.success("删除成功");
              // 删除成功，重新获取数据
              this.$emit("requestDataAgain");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          // 取消删除按钮的点击处理
          this.$message.info("已成功取消删除");
        });
    },
  },
};
</script>
<style lang="less" scoped></style>
