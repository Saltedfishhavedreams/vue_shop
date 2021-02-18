<template>
  <el-input
    class="input-new-tag"
    v-if="inputVisible"
    v-model="inputValue"
    ref="saveTagInput"
    size="small"
    @keyup.enter.native="handleInputConfirm"
    @blur="handleInputConfirm"
  >
  </el-input>
  <el-button v-else class="button-new-tag" size="small" @click="showInput">
    + New Tag
  </el-button>
</template>
<script>
import { getUserList } from "network/home.js";

export default {
  props: {
    scopeRowData: {
      type: Object,
      default() {
        return {};
      },
    },
    classId: Number,
  },
  data() {
    return {
      // 添加attr_vals input双向绑定的数据
      inputValue: "",
      // 控制input的显示与隐藏
      inputVisible: false,
    };
  },
  methods: {
    // 监听回车 和失去焦点
    handleInputConfirm() {
      this.inputVisible = false;
      if (this.inputValue.trim().length === 0) {
        return (this.inputValue = "");
      }
      this.scopeRowData.attr_vals.push(this.inputValue.trim());
      this.inputValue = "";
      this.sendDataToDatabase();
    },

    // 将数据存储至数据库
    sendDataToDatabase() {
      // 将保存的标签存储至数据库中
      // 发送一次网络请求
      getUserList({
        url: `categories/${this.classId}/attributes/${this.scopeRowData.attr_id}`,
        method: "put",
        data: {
          attr_name: this.scopeRowData.attr_name,
          attr_sel: this.scopeRowData.attr_sel,
          attr_vals: this.scopeRowData.attr_vals.join(" "),
        },
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("数据更新失败");
        }
        this.$message.success("数据修改成功");
      });
    },

    // 展示input框
    showInput() {
      this.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回掉函数中的代码
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
