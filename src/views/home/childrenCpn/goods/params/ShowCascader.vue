<template>
  <div>
    <span>选择商品分类 : </span>
    <el-cascader
      class="cate-cascader"
      v-model="selectedKeys"
      :options="cateList"
      :props="cascadeProps"
      @change="handleChange"
    ></el-cascader>

    <!-- tab 页签区域 -->
    <el-tabs v-model="activeName" @tab-click="handleChange">
      <!-- 添加动态参数面吧 -->
      <el-tab-pane label="动态参数" name="many">
        <el-table border :data="manyTableData">
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                closable
                v-for="(item, index) in scope.row.attr_vals"
                :key="index"
                @close="tagParamsDel(index, scope.row)"
              >
                {{ item }}
              </el-tag>

              <tag-input
                ref="tagParamsInputRef"
                :classId="cateId"
                :scopeRowData="scope.row"
              ></tag-input>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="showEditDialog(scope.row.attr_id)"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                @click="isDel(scope.row.attr_id)"
                type="danger"
                icon="el-icon-delete"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-button
          @click="showAddDialog"
          class="btn-add"
          type="primary"
          :disabled="btnIsClick"
        >
          添加参数
        </el-button>
      </el-tab-pane>

      <!-- 添加静态参数面吧 -->
      <el-tab-pane label="静态属性" name="only">
        <el-table border :data="onlyTableData">
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                closable
                v-for="(item, index) in scope.row.attr_vals"
                :key="index"
                @close="tagParamsDel(index, scope.row)"
              >
                {{ item }}
              </el-tag>

              <tag-input
                ref="tagParamsInputRef"
                :classId="cateId"
                :scopeRowData="scope.row"
              ></tag-input>
            </template>
          </el-table-column>
          <!-- <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                closable
                v-for="(item, index) in scope.row.attr_vals"
                :key="index"
                @close="tagAttrDel(index, scope.row)"
              >
                {{ item }}
              </el-tag>

              <tag-input
                ref="tagAttrInputRef"
                :classId="cateId"
                :scopeRowData="scope.row"
              ></tag-input>
            </template>
          </el-table-column> -->
          <!-- 索引列 -->
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column
            label="属性名称名称"
            prop="attr_name"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="showEditDialog(scope.row.attr_id)"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                @click="isDel(scope.row.attr_id)"
                type="danger"
                icon="el-icon-delete"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-button
          @click="showAddDialog"
          class="btn-add"
          type="primary"
          :disabled="btnIsClick"
        >
          添加属性
        </el-button>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加 属性/参数 的对话框 -->
    <add-dialog
      :activeName="activeName"
      :classId="cateId"
      ref="adddialogRef"
      @dataUpdate="handleChange"
    ></add-dialog>

    <!-- 修改 属性/参数 的对话框 -->
    <edit-dialog
      :activeName="activeName"
      :classId="cateId"
      ref="editdialogRef"
      @dataUpdate="handleChange"
      reqmethod="post"
    ></edit-dialog>
  </div>
</template>

<script>
import { getUserList } from "network/home.js";

import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import TagInput from "./TagInput";
export default {
  components: {
    AddDialog,
    EditDialog,
    TagInput,
  },
  computed: {
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
  data() {
    return {
      // 商品分类列表
      cateList: [],

      // 级联选择器的配置对象
      cascadeProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        // checkStrictly: true,
      },

      selectedKeys: [],

      // 被激活的标签页的名称  默认动态参数被激活
      activeName: "many",
      // 控制添加参数按钮是否可以点击 true 代表不能点击
      btnIsClick: true,

      // 动态数据列表
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    // 获取所有商品的分类列表
    getCategoryList() {
      getUserList({ url: "/categories" }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("分类列表数据获取失败");
        }
        this.cateList = res.data.data;
      });
    },

    // 监听级联选择器数据改变
    // Tabs 同样使用此方法  tab栏点击事件
    handleChange() {
      this.$emit("changeBtnClick");
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      getUserList({
        url: `categories/${this.cateId}/attributes`,
        params: {
          sel: this.activeName,
        },
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("数据请求失败");
        }
        // 请求数据中attr_vals是一串以空格分开的字符串
        res.data.data.forEach((value) => {
          value.attr_vals = value.attr_vals ? value.attr_vals.split(" ") : [];
        });
        if (this.activeName === "many") {
          this.manyTableData = res.data.data;
        } else {
          this.onlyTableData = res.data.data;
        }
      });
    },

    // 显示添加对话框
    showAddDialog() {
      this.$refs.adddialogRef.addDialogVisible = true;
    },
    showEditDialog(attrId) {
      this.$refs.editdialogRef.addDialogVisible = true;
      this.$refs.editdialogRef.getAttr_name(attrId);
    },

    // 删除参数
    isDel(attrId) {
      this.$confirm(`此操作将永久删除该${this.titleText}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          getUserList({
            url: `categories/${this.cateId}/attributes/${attrId}`,
            method: "delete",
          }).then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("删除失败");
            }
            this.$message.success("删除成功");
            this.handleChange();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 删除标签
    tagParamsDel(index, scopeRow) {
      scopeRow.attr_vals.splice(index, 1);
      this.$refs.tagParamsInputRef.sendDataToDatabase();
    },

    // tagAttrDel(index, scopeRow) {
    //   scopeRow.attr_vals.splice(index, 1);
    //   this.$refs.tagAttrInputRef.sendDataToDatabase();
    // },
  },
};
</script>

<style lang="less" scoped>
.cate-cascader {
  width: 20%;
}
.btn-add {
  margin-top: 15px;
}

.el-tag {
  margin-left: 10px;
}
</style>
