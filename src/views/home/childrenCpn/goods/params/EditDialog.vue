<template>
  <!-- 添加 属性/参数 的对话框 -->
  <el-dialog
    :title="'添加' + titleText"
    :visible.sync="addDialogVisible"
    width="50%"
    @close="editDialogClosed"
  >
    <el-form
      ref="editFormRef"
      :model="editForm"
      label-width="80px"
      :rules="editFormRules"
    >
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="editForm.attr_name"></el-input>
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
      editForm: {
        attr_name: "",
      },

      attrId: Number,

      // 表单校验规则
      editFormRules: {
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
    getAttr_name(attrId) {
      this.attrId = attrId;
      getUserList({
        url: `categories/${this.classId}/attributes/${this.attrId}`,
        params: {
          attr_sel: this.activeName,
        },
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("数据请求错误");
        }
        this.editForm.attr_name = res.data.data.attr_name;
      });
    },

    // 添加对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 提交表单数据
    dataSubmission() {
      this.$refs.editFormRef.validate((vali) => {
        if (!vali) return;
        getUserList({
          url: `categories/${this.classId}/attributes/${this.attrId}`,
          method: "put",
          data: {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          },
        }).then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error(this.titleText + "修改失败");
          }
          this.$message.success("修改成功");
          // 数据列表更新
          this.$emit("dataUpdate");
          this.addDialogVisible = false;
        });
      });
    },
  },
};
</script>
