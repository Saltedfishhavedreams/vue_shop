<template>
  <!-- 添加 属性/参数 的对话框 -->
  <el-dialog
    :title="'添加' + titleText"
    :visible.sync="addDialogVisible"
    width="50%"
    @close="addDialogClosed"
  >
    <el-form
      ref="addFormRef"
      :model="addForm"
      label-width="80px"
      :rules="addFormRules"
    >
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dataSubmission">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserList } from "network/home.js";
export default {
  props: {
    activeName: {
      type: String,
      default: "",
    },
    classId: Number,
  },
  data() {
    return {
      // 控制添加对话框是否显示
      addDialogVisible: false,

      // 表单参数
      addForm: {
        attr_name: "",
      },

      // 表单校验规则
      addFormRules: {
        attr_name: [
          { required: true, message: "输入框不能为空", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "产品名字长度在2~10之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    // 控制添加对话框的title的值
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
  methods: {
    // 添加对话框关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    // 提交表单数据
    dataSubmission() {
      this.$refs.addFormRef.validate((vali) => {
        if (!vali) return;
        getUserList({
          url: `categories/${this.classId}/attributes`,
          method: "post",
          data: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          },
        }).then((res) => {
          if (res.data.meta.status !== 201) {
            return this.$message.error(this.titleText + "添加失败");
          }
          this.$message.success("添加成功");
          // 数据列表更新
          this.$emit("dataUpdate");
          this.addDialogVisible = false;
        });
      });
    },
  },
};
</script>
