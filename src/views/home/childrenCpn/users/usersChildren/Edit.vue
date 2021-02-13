<template>
  <el-dialog
    title="修改用户"
    @close="editDialogClosed"
    :visible.sync="editVisible"
    width="50%"
  >
    <el-form
      :model="editForm"
      status-icon
      :rules="editFormRules"
      label-width="70px"
      ref="editFormRef"
      :class="{ requestException: isHide }"
    >
      <el-form-item label="用户名">
        <el-input v-model="editForm.username" readonly disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="editVisible = false">取 消</el-button>
      <el-button type="primary" @click="changeData">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserList } from "network/home.js";
export default {
  data() {
    // 定义邮箱的校验规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 合法的邮箱 直接放行
        return cb();
      }
      // 邮箱验证未通过
      cb(new Error("请输入正确的邮箱地址"));
    };

    // 定义手机号的校验规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        // 合法的手机号 直接放行
        return cb();
      }
      // 手机号验证未通过
      cb(new Error("请输入正确的手机号码"));
    };
    return {
      // 被编辑用户的id
      id: null,
      // 控制修改面板是否显示
      editVisible: false,
      // 添加编辑用户的校验规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 编辑用户双向绑定的数据
      editForm: {
        username: "",
        email: "",
        mobile: "",
      },

      // 表单数据是否请求异常 根据异常来判断是否隐藏表单
      isHide: false,
    };
  },
  created() {
    this.$bus.$on("changeEditVisible", (id) => {
      this.editVisible = !this.editVisible;
      this.id = id;
      this.getUserData();
    });
  },
  methods: {
    // 向服务器请求被编辑用户的数据
    getUserData() {
      getUserList({
        url: "/users/" + this.id,
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          this.$message.error(res.data.meta.msg);
          // 异常隐藏表单
          this.isHide = true;
          // 两秒后 隐藏 编辑对话框
          setTimeout(() => {
            this.editVisible = false;
          }, 2000);
        }
        this.editForm.username = res.data.data.username;
        this.editForm.email = res.data.data.email;
        this.editForm.mobile = res.data.data.mobile;
      });
    },
    // 修改数据
    changeData() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) {
          this.editVisible = false;
          return this.$message.error("提交失败");
        }
        getUserList({
          url: "/users/" + this.id,
          method: "put",
          data: {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
            id: this.id,
          },
        }).then((res) => {
          if (res.data.meta.status !== 200) {
            this.editVisible = false;
            return this.$message.error("提交失败");
          }
          // 隐藏对话框
          this.editVisible = false;
          this.$message.success("数据更新成功");
          // 重新请求最新数据
          this.$emit("requestDataAgain");
        });
      });
    },

    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.requestException {
  display: none;
}
</style>
