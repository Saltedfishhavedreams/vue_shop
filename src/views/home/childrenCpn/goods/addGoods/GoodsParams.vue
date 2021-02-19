<template>
  <div>
    <el-form-item
      :label="item.attr_name"
      v-for="(item, index) in manyTableData"
      :key="index"
    >
      <el-checkbox-group v-model="item.attr_vals">
        <el-checkbox
          border
          :label="cb"
          v-for="(cb, i) in item.attr_vals"
          :key="i"
        ></el-checkbox>
      </el-checkbox-group>
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
      manyTableData: [],
    };
  },
  methods: {
    getGoodsParams(cateId) {
      getUserList({
        url: `categories/${cateId}/attributes`,
        params: {
          sel: "many",
        },
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("表格数据获取失败");
        }
        // attr_vals默认是一个以空格分割的字符串
        // 循环将attr_vals 变成一个数组
        res.data.data.forEach((value) => {
          value.attr_vals =
            value.attr_vals.length !== 0 ? value.attr_vals.split(" ") : [];
        });
        this.manyTableData = res.data.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin-right: 10px !important;
}
</style>
