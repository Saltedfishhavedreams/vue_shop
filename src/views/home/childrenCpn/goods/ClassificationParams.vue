<template>
  <div>
    <!-- 面包屑导航区域 -->
    <elbreadcurumb :titles="['商品管理', '参数列表']" />

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意: 只允许第三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col :span="24">
          <!-- 选择商品分类的级联选择框 -->
          <show-cascader
            @changeBtnClick="btnIsClick"
            ref="cascaderRef"
          ></show-cascader>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import Elbreadcurumb from "components/conect/breadcurumb/Elbreadcurumb.vue";

import ShowCascader from "./params/ShowCascader";
export default {
  components: {
    Elbreadcurumb,
    ShowCascader,
  },
  methods: {
    // 控制添加参数按钮是否可以点击
    btnIsClick() {
      if (this.$refs.cascaderRef.selectedKeys.length !== 3) {
        return (this.$refs.cascaderRef.btnIsClick = true);
      }
      this.$refs.cascaderRef.btnIsClick = false;
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
</style>
