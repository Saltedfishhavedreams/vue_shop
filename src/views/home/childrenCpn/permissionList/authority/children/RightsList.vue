<template>
  <el-table :data="rightsList" border stripe>
    <el-table-column label="#" type="index"></el-table-column>
    <el-table-column label="权限名称" prop="authName"></el-table-column>
    <el-table-column label="路径" prop="path"></el-table-column>
    <el-table-column label="权限等级" prop="level">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.level == 0">一级</el-tag>
        <el-tag v-else-if="scope.row.level == 1" type="success">
          二级
        </el-tag>
        <el-tag v-else type="warning">三级</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    rightsList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>
<style lang="less" scoped></style>
