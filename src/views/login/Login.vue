<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~assets/images/logo.png" alt="" />
      </div>

      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item label="" prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="" prop="password">
          <el-input
            prefix-icon="iconfont icon-passwd"
            type="password"
            v-model="loginForm.password"
          >
          </el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" plain @click="loginClick">登录</el-button>
          <el-button type="info" plain @click="loginFormReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginData } from "network/login";

export default {
  data() {
    return {
      // 登录表单数据的双向绑定
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: "请填写登录用户名", trigger: "blur" },
          { min: 2, max: 10, message: "用户名长度在2-10之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请填写登录密码", trigger: "blur" },
          { min: 6, max: 16, message: "用户名长度在6-16之间", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 重置表单
    loginFormReset(reset) {
      this.$refs.loginFormRef.resetFields();
    },
    // 登录验证
    loginClick() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await loginData(
          this.loginForm.username,
          this.loginForm.password
        );
        if (res.meta.status !== 200) return this.$message.error("登录失败");
        // 1、将登录成功之后的 token 保存到客户端的 sessionStorage 中
        //  1、1 项目中除了登录之外的其他接口，必须在登录之后才能访问
        //  1、2 token 只应在当前网站打开期间生效，所以将touken保存在sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        // 2、重定向到/home
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #fff;
  }
}

.login_form {
  position: absolute;
  bottom: 0%;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
