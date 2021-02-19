<template>
  <el-form-item label="商品图片">
    <!-- action 需要上传的地址 -->
    <el-upload
      :action="upLoadUrl"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      list-type="picture"
      :headers="headerObj"
      :on-success="handleSuccess"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>

    <!-- 照片预览对话框 -->
    <el-dialog title="照片预览" :visible.sync="previewVisible" width="50%">
      <img class="previewImg" :src="previewImgUrl" alt="" />
    </el-dialog>
  </el-form-item>
</template>

<script>
export default {
  props: {
    addForm: {
      type: Object,
      default() {
        return {};
      },
    },
    addFormRules: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      // 图片上传地址
      upLoadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 设置上传图片头部对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 设置预览照片的地址
      previewImgUrl: "",
      // 控制预览对话框的显示与隐藏
      previewVisible: false,
    };
  },
  methods: {
    // 预览图片执行的函数
    handlePreview(file) {
      this.previewImgUrl = file.response.data.url;
      this.previewVisible = true;
    },
    // 删除图片执行的函数
    handleRemove(file) {
      // 获取被删除图片的临时路径
      const pic_path = file.response.data.tmp_path;
      // 获取被删除图片位于addForm.pics中的索引值
      const pic_index = this.addForm.pics.findIndex((x) => x.pic === pic_path);
      // 移除该临时路径
      this.addForm.pics.splice(pic_index, 1);
    },
    // 文件上传成功
    handleSuccess(response) {
      // 上传成功之后服务器响应的对象
      const picInfo = {
        pic: response.data.tmp_path,
      };
      this.addForm.pics.push(picInfo);
    },
  },
};
</script>

<style lang="less" scoped>
.previewImg {
  width: 100%;
}
</style>
