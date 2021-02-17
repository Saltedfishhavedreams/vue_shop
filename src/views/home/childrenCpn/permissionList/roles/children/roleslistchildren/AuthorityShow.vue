<template>
  <!-- 展开列 -->
  <el-table-column type="expand">
    <template slot-scope="scope">
      <el-row
        :class="[
          'borderBottom',
          index1 === 0 ? 'borderTop' : '',
          'text-center',
        ]"
        v-for="(item1, index1) in scope.row.children"
        :key="index1"
      >
        <!-- 渲染一级权限 -->
        <el-col :span="5">
          <el-tag>{{ item1.authName }}</el-tag>
          <i class="el-icon-caret-right"></i>
        </el-col>
        <!-- 二级权限渲染 -->
        <el-col :span="19">
          <el-row
            v-for="(item2, index2) in item1.children"
            :key="index2"
            :class="{ borderTop: index2 !== 0 }"
            class="text-center"
          >
            <el-col :span="6">
              <el-tag type="success">{{ item2.authName }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 三级权限渲染 -->
            <el-col :span="18">
              <el-tag
                v-for="(item3, index3) in item2.children"
                :key="index3"
                type="warning"
                closable
                @close="removeTag(scope.row, item3.id)"
              >
                {{ item3.authName }}
              </el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </template>
  </el-table-column>
</template>

<script>
import { getUserList } from "network/home.js";
export default {
  props: {
    rolesList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    removeTag(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          getUserList({
            url: `roles/${role.id}/rights/${rightId}`,
            method: "delete",
          }).then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("网络异常,删除失败");
            }
            this.$message.success(res.data.meta.msg);

            // 删除之后返回新的权限数据  把最新的权限数据 赋值给原来角色
            role.children = res.data.data;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 10px;
}

.borderTop {
  border-top: 1px solid #ff8400;
}

.borderBottom {
  border-bottom: 1px solid #ff8400;
}

.text-center {
  display: flex;
  align-items: center;
}
</style>
