<template>
  <div>
    <el-form-item label="商品名称" prop="goods_name">
      <el-input v-model="addForm.goods_name"></el-input>
    </el-form-item>
    <el-form-item label="商品价格" prop="goods_price">
      <el-input type="number" v-model="addForm.goods_price"></el-input>
    </el-form-item>
    <el-form-item label="商品重量" prop="goods_weight">
      <el-input type="number" v-model="addForm.goods_weight"></el-input>
    </el-form-item>
    <el-form-item label="商品数量" prop="goods_number">
      <el-input type="number" v-model="addForm.goods_number"></el-input>
    </el-form-item>
    <el-form-item label="商品分类">
      <el-cascader
        v-model="addForm.goods_cat"
        :options="categoryList"
        :props="categoryProps"
        @change="handleChange"
        size="samll"
      ></el-cascader>
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
      // 分类列表数据
      categoryList: [],
      // 级联选择器配置对象
      categoryProps: {
        value: "cat_id",
        label: "cat_name",
        expandTrigger: "hover",
        children: "children",
      },
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    // 获取商品分类列表
    getCategoryList() {
      getUserList({
        url: "/categories",
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("数据请求失败");
        }
        this.categoryList = res.data.data;
      });
    },
    // 监听级联选择器 值发生变化
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = []);
      }
    },
  },
};
</script>
