<template>
  <el-dialog
    title="提示"
    :visible.sync="setRoleDialogVisible"
    width="30%"
    @close="assignRoleDialogClosed"
  >
    <div>
      <p>当前的用户: {{ userInfo.username }}</p>
      <p>当前的角色: {{ userInfo.role_name }}</p>
      <p>
        分配新角色:
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="setRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveRoleInfo">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserList } from "network/home.js";
export default {
  props: {
    // 对应用户的数据
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      // 控制分配角色对话框是否显示
      setRoleDialogVisible: false,
      // 所有角色列表
      rolesList: [],
      // el-select双向绑定的id值
      selectedRoleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取所有角色列表
    getRolesList() {
      getUserList({ url: "roles" }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("角色列表获取失败");
        }
        this.rolesList = res.data.data;
      });
    },
    // 处理数据提交
    saveRoleInfo() {
      getUserList({
        url: `users/${this.userInfo.id}/role`,
        data: {
          rid: this.selectedRoleId,
        },
        method: "put",
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("更新角色失败");
        }
        this.$message.success("角色更新成功");
        this.$emit("userListUpdate");
        this.setRoleDialogVisible = false;
      });
    },
    // 分配权限对话框关闭
    assignRoleDialogClosed() {
      this.selectedRoleId = "";
    },
  },
};
</script>

<style lang="less" scoped></style>
