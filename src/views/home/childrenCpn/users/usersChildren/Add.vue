<template>
  <el-dialog
    title="提示"
    @close="addDialogClosed"
    :visible.sync="addDialogVisible"
    width="50%"
  >
    <!-- 内容主体区域 -->
    <el-form
      :model="addForm"
      status-icon
      :rules="addFormRules"
      label-width="70px"
      ref="addFormRef"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>

    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">
        确定
      </el-button>
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
      // 控制添加面板是否显示
      addDialogVisible: false,
      // 添加用户双向绑定的数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户的校验规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            max: 10,
            min: 2,
            message: "用户名长度在2~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            max: 115,
            min: 6,
            message: "密码长度在必须为6~15位的字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.$bus.$on("changeAddVisible", () => {
      this.addDialogVisible = !this.addDialogVisible;
    });
  },
  methods: {
    // 监听添加用户对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 向数据库中添加用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        // 判断提交前的验证是否通过
        if (!valid) {
          this.addDialogClosed();
          this.addDialogVisible = false;
          return this.$message.error("数据添加失败");
        }
        getUserList({
          url: "users",
          method: "post",
          data: this.addForm,
        }).then((res) => {
          if (res.data.meta.status !== 201) {
            return this.$message.error(res.data.meta.msg);
          }
          // 数据添加成功处理
          this.$message.success("用户添加成功");
          // 隐藏添加对话框
          this.addDialogVisible = false;
          // 向父组件发送重新获取展示数据的事件
          this.$emit("requestDataAgain");
        });
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
