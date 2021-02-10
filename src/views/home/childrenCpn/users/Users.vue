<template>
  <div class="users">
    <!-- 面包屑导航区域 -->
    <elbreadcurumb :titles="['用户管理', '用户列表']" />

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>

            <!-- 分配角色 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Elbreadcurumb from "components/conect/Elbreadcurumb.vue";

import { getUserList } from "network/home.js";

export default {
  name: "Users",
  components: {
    Elbreadcurumb,
  },
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      userList: [],
      total: null,
    };
  },
  created() {
    this.getUserData();
  },
  methods: {
    // 获取用户列表数据
    getUserData() {
      getUserList({
        url: "/users",
        params: this.queryInfo,
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg);
        }

        this.userList = res.data.data.users;
        this.total = res.data.data.total;
      });
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserData();
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserData();
    },

    // 更新数据库中用户状态
    userStateChanged(userInfo) {
      getUserList({
        url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
        method: "PUT",
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state;
          return this.$message.error("状态更改失败!");
        }
        this.$message.success("状态更新成功!");
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
