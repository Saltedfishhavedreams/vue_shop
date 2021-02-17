<template>
  <div>
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <table-list :rolesList="rolesList"></table-list>

        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>

        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button sizi="mini" type="primary" icon="el-icon-edit"
              >编辑
            </el-button>
            <el-button sizi="mini" type="danger" icon="el-icon-delete"
              >删除
            </el-button>
            <el-button
              sizi="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配角色对话框 -->
    <assign-roles ref="assignRolesRef"></assign-roles>
  </div>
</template>

<script>
import TableList from "./roleslistchildren/AuthorityShow";
import AssignRoles from "./roleslistchildren/AssignRoles";
export default {
  props: {
    rolesList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    TableList,
    AssignRoles,
  },
  methods: {
    // 展示分配权限对话框
    showSetRightDialog(role) {
      this.$refs.assignRolesRef.setRightDialogVisible = true;
      this.$refs.assignRolesRef.getJurisdiction(role);
    },
  },
};
</script>

<style lang="less" scoped></style>
