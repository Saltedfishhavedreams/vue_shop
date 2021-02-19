<template>
  <div>
    <!-- 面包屑导航 -->
    <elbreadcurumb :titles="['商品管理', '商品添加']" />

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示框 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>

      <!-- 进度条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <!-- 基本参数 -->
          <el-tab-pane label="基本信息" name="0">
            <basic-params
              :addForm="addForm"
              :addFormRules="addFormRules"
            ></basic-params>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <goods-params
              ref="goodsParamsRef"
              :addForm="addForm"
              :addFormRules="addFormRules"
            ></goods-params>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <goods-attr
              ref="goodsAttrRef"
              :addForm="addForm"
              :addFormRules="addFormRules"
            ></goods-attr>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <goods-picture
              ref="goodsPictureRef"
              :addForm="addForm"
              :addFormRules="addFormRules"
            >
            </goods-picture>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <rich-text
              @addProduct="addProduct"
              ref="richTextRef"
              :addForm="addForm"
              :addFormRules="addFormRules"
            ></rich-text>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Elbreadcurumb from "components/conect/breadcurumb/Elbreadcurumb.vue";

import BasicParams from "./addGoods/BasicParams";
import GoodsParams from "./addGoods/GoodsParams";
import GoodsAttr from "./addGoods/GoodsAttr";
import GoodsPicture from "./addGoods/GoodsPicture";
import RichText from "./addGoods/RichText";

import _ from "lodash";

import { getUserList } from "network/home.js";
export default {
  computed: {
    // 商品分类id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  components: {
    Elbreadcurumb,
    BasicParams,
    GoodsParams,
    GoodsAttr,
    GoodsPicture,
    RichText,
  },
  data() {
    return {
      activeIndex: 0,
      // 表单数据
      addForm: {
        goods_name: "",
        // 商品所属的分类数组
        goods_cat: [],
        goods_number: 0,
        goods_weight: 0,
        goods_price: 0,
        // 商品图片数组
        pics: [],
        // 商品详情
        goods_introduce: "",
        // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
        attrs: [],
      },

      // 表单验证对象
      addFormRules: {
        goods_name: [
          { required: true, message: "请填写商品名称", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请填写商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请填写商品重量", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请填写商品价格", trigger: "blur" },
        ],
        goods_introduce: [
          { required: true, message: "商品描述信息不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    // tab栏切换处理
    beforeTabLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3 && oldActiveName == 0) {
        this.$message.error("请先选择分类再进行下一步操作");
        return false;
      }
    },
    // tab栏点击事件
    tabClick() {
      // this.$refs.addFormRef.resetFields();
      if (this.activeIndex - 0 === 1) {
        this.$refs.goodsParamsRef.getGoodsParams(this.cateId);
      } else if (this.activeIndex - 0 === 2) {
        this.$refs.goodsAttrRef.getGoodsAttr(this.cateId);
      }
    },
    // 添加商品
    addProduct() {
      this.$refs.addFormRef.validate((vali) => {
        if (!vali) {
          return this.$message.error("表单数据尚不完整");
        }
        // 逻辑处理
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        // 处理动态参数
        this.$refs.goodsParamsRef.manyTableData.forEach((value) => {
          let formItem = {
            attr_id: value.attr_id,
            attr_value: value.attr_vals,
          };
          form.attrs.push(formItem);
        });
        // 处理静态属性
        this.$refs.goodsAttrRef.onlyTableData.forEach((value) => {
          let formItem = {
            attr_id: value.attr_id,
            attr_value: value.attr_vals,
          };
          form.attrs.push(formItem);
        });
        // 发送网络请求
        getUserList({
          url: "goods",
          method: "post",
          data: form,
        }).then((res) => {
          if (res.data.meta.status !== 201) {
            return this.$message.error(res.data.meta.msg);
          }
          this.$message.success("商品添加成功");
          // 跳转至商品列表页面
          this.$router.push("/goods");
        });
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
