<template>
  <div>
    <el-form-item
      v-for="(item, index) in onlyTableData"
      :key="index"
      :label="item.attr_name"
    >
      <el-input v-model="item.attr_vals"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import { getUserList } from "network/home.js";
export default {
  props: {
    addForm: {
      type: Object,
      default() {
        return {};
      },
    },
    addFormRules: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      onlyTableData: [],
    };
  },
  methods: {
    getGoodsAttr(cateId) {
      getUserList({
        url: `categories/${cateId}/attributes`,
        params: {
          sel: "only",
        },
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("表格数据获取失败");
        }
        this.onlyTableData = res.data.data;
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
