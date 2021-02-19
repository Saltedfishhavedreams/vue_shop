<template>
  <div>
    <!-- 面包屑导航区域 -->
    <elbreadcurumb :titles="['商品管理', '商品列表']" />

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="qeuryValue"
            clearable
            @clear="searchGoods"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoods"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 数据列表展示 -->
      <show-list-data ref="goodsListRef"></show-list-data>
    </el-card>
  </div>
</template>

<script>
import Elbreadcurumb from "components/conect/breadcurumb/Elbreadcurumb.vue";

import ShowListData from "./goodsList/ShowListData";
export default {
  components: {
    Elbreadcurumb,
    ShowListData,
  },
  data() {
    return {
      qeuryValue: "",
    };
  },
  methods: {
    // 搜索商品
    searchGoods() {
      this.$refs.goodsListRef.queryInfo.query = this.qeuryValue;
      this.$refs.goodsListRef.getGoodsList();
    },

    // 添加商品
    addGoods() {
      this.$router.push("/goods/add");
    },
  },
};
</script>

<style lang="less" scoped></style>
