<template>
  <el-dialog
    title="分配权限"
    :visible.sync="setRightDialogVisible"
    width="50%"
    @close="dialogClosed"
  >
    <el-tree
      :data="rightsList"
      :props="treeProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="defkeys"
      ref="treeRef"
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="setRightDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitData">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserList } from "network/home.js";
export default {
  data() {
    return {
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中的节点id值
      defkeys: [],
      // 当前角色的实例对象
      role: {},
    };
  },
  created() {
    // this.getJurisdiction();
  },
  methods: {
    // 获取所有可选择的权限
    getJurisdiction(role) {
      this.dialogClosed();
      getUserList({
        url: "rights/tree",
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("网络异常,数据获取失败");
        }
        this.rightsList = res.data.data;
        // 获取默认被选中的节点
        this.getLeafKey(role, this.defkeys);
      });
      this.role = role;
    },

    // 通过递归 获取角色下所有的三级权限的id 并保存刀defkeys数组中
    getLeafKey(node, arr) {
      // 判断该节点是否有children属性 没有则直接将该节点的id push进arr中
      if (!node.children) {
        return arr.push(node.id);
      }
      // 循环children
      node.children.forEach((value) => {
        this.getLeafKey(value, arr);
      });
    },

    // 权限对话框关闭处理
    dialogClosed() {
      this.defkeys = [];
    },

    // 数据提交处理
    submitData() {
      let arr = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys(),
      ].join(",");
      getUserList({
        url: `roles/${this.role.id}/rights`,
        data: {
          rids: arr,
        },
        method: "post",
      })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("网络异常,数据提交失败");
          }
          this.$message.success("数据提交成功");
          // 更新展示节点的数据
          this.$bus.$emit("updateData");
          this.setRightDialogVisible = false;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
