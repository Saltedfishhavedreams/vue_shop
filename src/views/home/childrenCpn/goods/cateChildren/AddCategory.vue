<template>
  <!-- 添加分类 -->
  <el-dialog
    title="添加分类"
    @close="addCateDialogClosed"
    :visible.sync="addCateDialogVisible"
    width="50%"
  >
    <!-- 表单区域 -->
    <el-form
      ref="addCateFormRef"
      :model="addCateForm"
      label-width="100px"
      :rules="addCateFormRules"
    >
      <el-form-item label="分类名称: " prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>

      <el-form-item label="父级分类: " prop="cat_name">
        <!-- options 指定数据源 -->
        <!-- props 用来指定配置对象 -->
        <el-cascader
          v-model="selectedKeys"
          :options="parentCateList"
          :props="cascadeProps"
          clearable
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="addCateDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCate">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserList } from "network/home.js";
export default {
  data() {
    return {
      // 控制添加分类对话框是否显示
      addCateDialogVisible: false,

      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 需要添加的分类等级 默认是一级分类
        cat_level: 0,
      },

      // 表单校验规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },

      // 父级分类列表
      parentCateList: [],

      // 级联选择器的配置对象
      cascadeProps: {
        value: "cat_id",
        label: "cat_name",
        expandTrigger: "hover",
        children: "children",
        checkStrictly: true,
      },

      selectedKeys: [],
    };
  },
  methods: {
    // 获取父级分类的数据列表
    getParentCateList() {
      getUserList({
        url: "/categories",
        params: {
          type: 2,
        },
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("数据获取失败");
        }
        this.parentCateList = res.data.data;
      });
    },
    handleChange() {
      // 如果 selectedKeys 的长度大于0 证明有选中父级分类
      // 反之 则没有选择父级分类
      if (this.selectedKeys.length > 0) {
        // 当前分类层级的赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        // 当前分类的父id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
      } else {
        this.addCateForm.cat_level = 0;
        this.addCateForm.cat_pid = 0;
      }
    },

    // 向数据库中添加 分类
    addCate() {
      getUserList({
        url: "categories",
        method: "post",
        data: this.addCateForm,
      }).then((res) => {
        if (res.data.meta.status !== 201) {
          return this.$message.error("分类添加失败");
        }
        this.$message.success("添加成功");
        this.$emit("updateCateList");
        this.addCateDialogVisible = false;
      });
    },
    // 添加分类对话框关闭
    addCateDialogClosed() {
      this.addCateForm.cat_name = "";
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
