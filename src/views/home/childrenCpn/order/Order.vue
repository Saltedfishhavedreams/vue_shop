<template>
  <div>
    <!-- 面包屑导航 -->
    <elbreadcurumb :titles="['订单管理', '订单列表']"></elbreadcurumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">
              已付款
            </el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="orderEdit"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="logisticsProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      title="订单编辑"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="addressFormClose"
    >
      <el-form
        :model="addressForm"
        ref="addressFormRef"
        :rules="addressFormRules"
        label-width="100px"
        status-icon
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            expand-trigger="hover"
            v-model="addressForm.address1"
            :options="cityList"
            :props="cityProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度对框框 -->
    <el-dialog title="进度" :visible.sync="expressDialogVisible" width="50%">
    </el-dialog>
  </div>
</template>

<script>
import Elbreadcurumb from "components/conect/breadcurumb/Elbreadcurumb.vue";

import { getUserList } from "network/home.js";

import cityList from "./citydata";
export default {
  components: {
    Elbreadcurumb,
  },
  data() {
    return {
      // 订单查询条件
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,

      // 编辑对话框的显示与隐藏
      editDialogVisible: false,

      // 编辑表单
      addressForm: {
        address1: [],
        address2: "",
      },
      // 表单校验规则
      addressFormRules: {
        address1: [
          { required: true, message: "地址栏不能为空", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      // 城市列表
      cityList: [],
      // 级联选择器配置
      cityProps: {
        children: "children",
        label: "label",
        value: "value",
      },

      // 物流进度对话框显示与隐藏
      expressDialogVisible: false,
    };
  },
  created() {
    this.getOrderList();
    // this.getLogisticsProgress();
    this.cityList = cityList;
  },
  methods: {
    // 获取订单列表
    getOrderList() {
      getUserList({
        url: "/orders",
        params: this.queryInfo,
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("订单数据列表获取失败");
        }
        this.orderList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },

    // 获取快递进度
    // getLogisticsProgress() {
    //   getUserList({
    //     url: `/kuaidi/804909574412544580`,
    //   }).then((res) => {
    //     if (res.data.meta.status !== 200) {
    //       return this.$message.error("物流进度获取失败");
    //     }
    //     console.log(res);
    //   });
    // },

    // 编辑
    orderEdit() {
      this.editDialogVisible = true;
    },

    // 编辑对话框关闭
    addressFormClose() {
      this.$refs.addressFormRef.resetFields();
    },

    // 级联选择器发生变化
    handleChange() {
      console.log(this.addressForm.address1);
    },

    // 物流进度
    logisticsProgress() {
      return this.$message.error("请求失败");
      // this.expressDialogVisible = true;
    },
  },
};
</script>

<style lang="less" scoped></style>
