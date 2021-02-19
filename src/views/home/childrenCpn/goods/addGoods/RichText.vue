<template>
  <el-form-item label="商品描述" prop="goods_introduce">
    <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor">
    </quill-editor>
    <el-button class="downward-offset" type="primary" @click="addGoods">
      添加商品
    </el-button>
  </el-form-item>
</template>

<script>
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
  methods: {
    // 添加商品
    addGoods() {
      this.$emit("addProduct");
    },
  },
};
</script>

<style lang="less" scoped>
.downward-offset {
  margin-top: 15px;
}
</style>
