<template>
  <div>
    <el-table :data="goodsList" stripe border>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column
        width="70px"
        label="商品价格"
        prop="goods_price"
      ></el-table-column>
      <el-table-column
        width="70px"
        label="商品重量"
        prop="goods_weight"
      ></el-table-column>
      <el-table-column width="160px" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.upd_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="delGoods(scope.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
import { getUserList } from "network/home.js";
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },

      // 被展示的数据列表
      goodsList: [],
      // 数据总条数
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList() {
      getUserList({
        url: "/goods",
        params: this.queryInfo,
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("数据列表获取失败");
        }
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },

    // pagesize发生改变 重新请求数据
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },

    // pagenum发生改变 重新请求数据
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },

    // 删除商品信息
    delGoods(goodsId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          getUserList({
            url: `goods/${goodsId}`,
            method: "delete",
          }).then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("数据删除失败");
            }
            this.$message.success("删除成功");
            this.getGoodsList();
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
