<template>
  <div>
    <!-- 面包屑导航区域 -->
    <elbreadcurumb :titles="['用户管理', '用户列表']" />

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateClick">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="tree-table"
        :data="categoryList"
        :columns="columns"
        show-index
        index-text="#"
        border
        :selection-type="false"
        :expand-type="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-error"
            v-if="scope.row.cat_deleted === false"
            style="color: red;"
          ></i>
          <i class="el-icon-success" v-else style="color: lightgreen;"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级标签</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
          >
            二级标签
          </el-tag>
          <el-tag size="mini" type="warning" v-else>三级标签</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit">
            编辑
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">
            删除
          </el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <add-category
      ref="addCateRef"
      @updateCateList="getCategoryList"
    ></add-category>
  </div>
</template>

<script>
import Elbreadcurumb from "components/conect/breadcurumb/Elbreadcurumb.vue";

import { getUserList } from "network/home.js";

import AddCategory from "./cateChildren/AddCategory";
export default {
  components: {
    Elbreadcurumb,
    AddCategory,
  },
  data() {
    return {
      // 分类列表查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },

      // 商品分类的数据列表
      categoryList: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示，将当前列定义为模板列
          type: "template",
          // 指定slot值为isok的template模板
          // 表示当前这列使用的模板名称
          template: "isok",
        },
        {
          label: "排序",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这列使用的模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这列使用的模板名称
          template: "opt",
        },
      ],
    };
  },
  created() {
    // 组件实例创建完毕获取分类列表数据
    this.getCategoryList();
  },
  methods: {
    // 获取分类列表数据
    getCategoryList() {
      getUserList({
        url: "categories",
        params: this.queryInfo,
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("数据请求失败");
        }
        this.categoryList = res.data.data.result;
        this.total = res.data.data.total;
      });
    },

    // 监听页面大小发生改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCategoryList();
    },

    // 监听页码是否发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCategoryList();
    },

    // 显示添加分类对话框
    addCateClick() {
      // 先获取父级分类的数据列表
      this.$refs.addCateRef.getParentCateList();
      // 然后在展示添加分类对话框
      this.$refs.addCateRef.addCateDialogVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
</style>
