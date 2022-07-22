<template>
  <div class="home">
    <!-- 左侧菜单 - 区分文件类型 -->
    <SideMenu class="home-left" :storageValue="storageValue"></SideMenu>
    <!-- 右侧内容区 -->
    <div class="home-right">
      <!-- 面包屑导航栏-->
      <BreadCrumb :fileType="fileType" style="height: 30px"></BreadCrumb>
      <router-view />
      <div class="right-main">
        <div class="operation-wrapper">
          <div>
            <el-row :gutter="10" v-if="fileType === 0">
              <el-col>
                <el-select v-model="fileTypeValue" placeholder="请选择上传类型" clearable style="margin-right: 10px;">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.remark">
                  </el-option>
                </el-select>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addFolderDialog.visible = true">新建文件夹</el-button>
                <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleUploadFile()">上传文件</el-button>
                <el-button size="mini" type="primary" icon="el-icon-refresh" @click="getFileData()">刷  新</el-button>
              </el-col>
            </el-row>
          </div>
          <!--<OperationMenu
            :fileType="fileType"
            :filePath="filePath"
            @getTableData="getFileData"
            @handleUploadFile="handleUploadFile"
            @handleSelectFile="setOperationFile"
            @handleMoveFile="setMoveFileDialog"
            :operationFileList="operationFileList"
          ></OperationMenu>
-->
          <FileUploader ref="globalUploader" @getTableData="getFileData" :fileTypeValue="parseInt(fileTypeValue)"
                        :filePath="filePath"></FileUploader>
        </div>
        <div class="table-data">
          <el-table
            class="file-table"
            :data="tableData"

            :row-style="{ height: '50px' }"
            :cell-style="{ padding: '0px' }"
            style="width: 100%;height: 100%;overflow-y: auto"
            v-loading="loading"
            @selection-change="handleSelectionChange"
          >
            <!-- 勾选框 -->
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column label prop="isDirectory" width="50" align="center">
              <template slot-scope="scope">
                <div style="cursor: pointer" @click="handleFileNameClick(scope.row)">
                  <img :src="setFileImg(scope.row)" style="width: 30px" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="fileName" label="文件名">
              <template slot-scope="scope">
                <div style="cursor: pointer" @click="handleFileNameClick(scope.row)">
                  <!--                  {{ scope.row.fileType ? `${scope.row.fileName}.${scope.row.fileType}` : `${scope.row.fileName}` }}-->
                  {{ scope.row.fileName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="extendName" label="类型" width="150" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isDirectory === '1'">文件夹</span>
                <span v-else>其他</span>
              </template>
            </el-table-column>
            <el-table-column prop="fileSize" label="大小" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ calculateFileSize(scope.row.fileSize) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fileDate" label="上传日期" width="200" align="center"></el-table-column>>
            <!-- 表格操作列 自定义表格头 原有的 label="操作" 需要删除 -->
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <!-- 操作列收缩状态下的按钮 -->
                <el-dropdown trigger="click">
                  <el-button size="mini">操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleClickDelete(scope.row)">删除</el-dropdown-item>
                    <!--<el-dropdown-item @click.native="handleClickMove(scope.row)" v-if="fileType <= 7">移动</el-dropdown-item>-->
                    <el-dropdown-item @click.native="handleClickRename(scope.row)">重命名</el-dropdown-item>
                    <el-dropdown-item @click.native="getDownloadPath(scope.row)">下载</el-dropdown-item>
                    <!-- <el-dropdown-item>
                       <a target="_blank" :href="getDownloadPath(scope.row)">下载</a>
                     </el-dropdown-item>-->
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->

        </div>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getFileData"
        />
        <!-- 移动文件模态框 -->
        <MoveFileDialog
          :dialogMoveFile="dialogMoveFile"
          @setSelectFilePath="setSelectFilePath"
          @confirmMoveFile="confirmMoveFile"
          @handleMoveFile="setMoveFileDialog"
        ></MoveFileDialog>
        <!-- 流文件在线查看组件 -->
      </div>
    </div>

    <!-- 对话框 - 新建文件夹 -->
    <!-- @closed 对话框关闭动画结束时 重置表单并清空所有表单校验 -->
    <el-dialog
      title="新建文件夹"
      width="600px"
      :visible.sync="addFolderDialog.visible"
      @closed="$refs.addFolderForm.resetFields()"
    >
      <el-form
        :model="addFolderForm"
        :rules="addFolderRules"
        label-position="top"
        ref="addFolderForm"
      >
        <el-form-item label="文件夹名称" prop="name">
          <el-input v-model="addFolderForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFolderDialog.visible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="addFolderDialog.loading"
          @click="handleAddFolderSubmit('addFolderForm')"
        >提 交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import SideMenu from "@/components/upload/SideMenu.vue"; //  引入左侧菜单组件
  import BreadCrumb from "@/components/upload/BreadCrumb.vue"; //  引入面包屑导航栏
  import MoveFileDialog from "@/components/upload/MoveFileDialog"; //  引入移动文件组件
  import FileUploader from "@/components/upload/FileUploader.vue"; // 文件上传组件

  import {
    batchMoveFile,
    getFileByName,
    getFileList,
    getFileTree,
    moveFile,
    deleteFile,
    renameFile,
    makerDir,
    downLoadFile
  } from "@/api/upload/upload";

  export default {
    name: "Upload",
    components: {
      SideMenu,
      BreadCrumb,
      FileUploader,
      MoveFileDialog,
    },
    data() {
      return {
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        storageValue: 0, //  存储空间占用大小
        loading: false,
        tableData: [], //  文件列表
        total: 0, //  总数
        queryParams: {
          pageNum: 1, //   页码
          pageSize: 10, //  每页显示条目个数
          filePath: '/',
          fileType: 1
        },
        //  移动文件模态框数据
        dialogMoveFile: {
          visible: false, //  对话框是否显示
          fileTree: [] //  目录树
        },
        isBatch: false, //  是否批量操作
        operationFile: {}, // 单个操作的文件信息
        operationFileList: [], // 批量操作的文件信息
        selectFilePath: "", //  目标路径
        fileImgMap: {
          csv: require("@/assets/images/upload/file_csv.png"),
          doc: require("@/assets/images/upload/file_word.svg"),
          excel: require("@/assets/images/upload/file_excel.svg"),
          exe: require("@/assets/images/upload/file_exe.png"),
          gif: require("@/assets/images/upload/file_gif.png"),
          html: require("@/assets/images/upload/file_html.png"),
          json: require("@/assets/images/upload/file_json.png"),
          mp3: require("@/assets/images/upload/file_music.png"),
          flac: require("@/assets/images/upload/file_music.png"),
          other: require("@/assets/images/upload/file_unknown.png"),
          pdf: require("@/assets/images/upload/file_pdf.png"),
          ppt: require("@/assets/images/upload/file_ppt.svg"),
          rar: require("@/assets/images/upload/file_rar.png"),
          svg: require("@/assets/images/upload/file_svg.png"),
          fold: require("@/assets/images/upload/dir.png"),
          txt: require("@/assets/images/upload/file_txt.png"),
          zip: require("@/assets/images/upload/file_zip.png"),
          wav: require("@/assets/images/upload/file_music.png"),
          mp4: require("@/assets/images/upload/file_avi.png")
        },
        typeOptions: [],
        fileTypeValue: undefined,
        // 新建文件夹对话框数据
        addFolderDialog: {
          visible: false, //  对话框显隐状态
          loading: false
        },
        // 新建文件夹表单
        addFolderForm: {
          name: ""
        },
        // 新建文件夹表单校验规则
        addFolderRules: {
          name: [
            {
              required: true,
              message: "请输入文件夹名称",
              trigger: "blur, change"
            }
          ]
        },
      };
    },
    computed: {
      // 左侧菜单选中的文件类型
      fileType() {
        return this.$route.query.fileType
          ? Number(this.$route.query.fileType)
          : 0;
      },
      // 查看模式
      // showModel() {
      //   return this.$store.getters.showModel;
      // },
      // 当前所在路径
      filePath() {
        return this.$route.query.filePath ? this.$route.query.filePath : "/";
      }
    },
    watch: {
      fileType() {
        this.getFileData(); //  获取文件列表
      },
      filePath() {
        // 当左侧菜单选择全部，文件路径发生变化时，再重新获取文件列表
        if (this.fileType === 0) {
          this.getFileData(); //  获取文件列表
        }
      }
    },
    mounted() {
      this.getFileData(); //  获取文件列表
    },
    // 获取用户信息
    created() {
      this.getDicts("file_upload_type").then((res) => {
        this.typeOptions = res.data;
      });
    },
    methods: {
      // 上传文件 按钮点击事件
      handleUploadFile() {
        if (this.fileTypeValue === undefined || this.fileTypeValue === null || this.fileTypeValue === 0) {
          this.$message.warning("请选择类型");
          return false;
        }
        //  触发子组件中的打开文件上传窗口事件
        this.$refs.globalUploader.triggerSelectFileClick();
      },
      // 获取文件列表
      getFileData() {
        this.loading = true; // 打开表格loading状态
        if (this.fileType === 0) {
          // 左侧菜单选择的为 全部 时，根据路径，获取文件列表
          this.queryParams.fileType = undefined;
          this.getFileDataByPath();
        } else {
          // 左侧菜单选择的为 除全部以外 的类型时，根据类型，获取文件列表
          this.getFileDataByType();
        }
        // this.getStorageValue(); //  获取文件占用空间
      },
      //  根据文件扩展名设置文件图片
      setFileImg(row) {
        if (row.isDirectory === "1") {
          //  文件夹
          return this.fileImgMap.fold;
        } else if (["jpg", "png", "jpeg", "gif"].includes(row.fileType)) {
          // 图片类型，直接显示缩略图
          return this.fileImgMap.other;
        } else {
          const fileTypeMap = {
            pptx: "ppt",
            doc: "word",
            docx: "doc",
            xls: "excel",
            xlsx: "excel"
          };
          //  可以识别文件类型的文件
          return (
            this.fileImgMap[row.fileType] ||
            this.fileImgMap[fileTypeMap[row.fileType]] ||
            this.fileImgMap.other
          );
        }
      },
      // 文件名点击事件
      handleFileNameClick(row) {
        //  若是目录则进入目录
        if (row.isDirectory === "1") {
          this.$router.push({
            query: {
              filePath: `${row.filePath}${row.fileName}/`,
              fileType: 0
            }
          });
        }
      },
      //  计算文件大小
      calculateFileSize(size) {
        const B = 1024;
        const KB = Math.pow(1024, 2);
        const MB = Math.pow(1024, 3);
        const GB = Math.pow(1024, 4);
        if (!size) {
          return " ";
        } else if (size < KB) {
          return (size / B).toFixed(0) + "KB";
        } else if (size < MB) {
          return (size / KB).toFixed(1) + "MB";
        } else if (size < GB) {
          return (size / MB).toFixed(2) + "GB";
        } else {
          return (size / GB).toFixed(3) + "TB";
        }
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      // 删除按钮 - 点击事件
      handleClickDelete(row) {
        // 消息弹框提示用户
        this.$confirm(
          "此操作将删除该文件, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            // 确定按钮 点击事件 调用删除文件接口
            deleteFile(row).then(res => {
              if (res.code === 200) {
                this.$message.success("删除成功");
                this.getFileData(); //  刷新文件列表
              }
            });
          })
          .catch(() => {
            //  取消
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      // 移动按钮 - 点击事件
      handleClickMove(row) {
        this.$emit("handleSelectFile", false, row); // true/false 批量移动/单文件操作；row 当前行文件数据
        this.$emit("handleMoveFile", true); // true/false 打开/关闭移动文件对话框
      },
      // 重命名按钮 - 点击事件
      handleClickRename(row) {
        const fileName = row.fileName;
        this.$prompt("请输入文件名", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: fileName,
          inputPattern: /\S/, //  文件名不能为空
          inputErrorMessage: "请输入文件名",
          closeOnClickModal: false
        })
          .then(({ value }) => {
            // 确定按钮 调用重命名接口
            row.fileName = value;
            renameFile(row).then(res => {
              if (res.code === 200) {
                this.$message.success("命名成功");
                this.getFileData(); //  刷新文件列表
              }
            }).catch( ()=> {
              this.getFileData();
            })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消"
            });
          });
      },
      // 下载按钮
      getDownloadPath(row) {
        // return this.getDownloadFile(row.id);
        downLoadFile(row.fileInbuckName).then(res => {
          if (res.code === 200) {
            this.$message.success("下载成功")
          }
        })
      },
      // 根据路径获取文件列表
      getFileDataByPath() {
        this.queryParams.filePath = this.filePath; // 传递当前路径
        getFileList(this.queryParams).then(
          res => {
            if (res.code === 200) {
              this.loading = false; //  关闭表格loading状态
              this.tableData = res.rows; // 表格数据赋值
              this.total = res.total; //  分页组件 - 文件总数赋值
            }
          },
          error => {
            this.loading = false;
            console.log(error);
          }
        );
      },
      // 根据类型获取文件列表
      getFileDataByType() {
        this.queryParams.fileType = this.fileType; // 传递当前路径
        getFileList(this.queryParams).then(res => {
            if (res.code === 200) {
              this.loading = false; //  关闭表格loading状态
              this.tableData = res.rows; // 表格数据赋值
              this.total = res.total; //  分页组件 - 文件总数赋值
            }
          },
          error => {
            this.loading = false;
            console.log(error);
          }
        );
      },
      //模糊查询获取文件列表
      getFileByName() {
        getFileByName({
          fileName: "7", //  文件名
          pageNum: this.queryParams.pageNum, //  当前页码
          pageSize: this.queryParams.pageSize //  每页条目数
        }).then(
          res => {
            this.loading = false; //  关闭表格loading状态
            this.tableData = res.rows; // 表格数据赋值
            this.total = res.total; //  分页组件 - 文件总数赋值
          },
          error => {
            this.loading = false;
            console.log(error);
          }
        );
      },

      /**
       * 设置移动文件时的文件信息
       * @param {Boolean} isBatch 是否批量移动，true 是批量移动，false 是单个文件操作
       * @param {Object | Array} file 需要移动的文件信息，单个操作时为Oject，批量操作时，为Array
       */
      setOperationFile(isBatch, file) {
        this.isBatch = isBatch; //  保存操作类型
        if (isBatch) {
          this.operationFileList = file; //  批量操作文件
        } else {
          this.operationFile = file; //  单个操作文件
        }
      },
      /**
       * 设置移动文件对话框相关数据
       * @param {Boolean} visible 打开/关闭移动文件模态框
       */
      setMoveFileDialog(visible) {
        this.dialogMoveFile.visible = visible; //  打开对话框
        if (visible) {
          // 打开对话框时，获取文件夹目录树
          getFileTree().then(res => {
            if (res.code === 200) {
              this.dialogMoveFile.fileTree = [res.data];
            } else {
              this.$message.error(res.code);
            }
          });
        }
      },
      //  设置移动文件的目标路径
      setSelectFilePath(selectFilePath) {
        this.selectFilePath = selectFilePath;
      },
      //  移动文件模态框-确定按钮事件
      confirmMoveFile() {
        if (this.isBatch) {
          //  批量移动
          batchMoveFile({
            filePath: this.selectFilePath,
            files: JSON.stringify(this.operationFileList)
          }).then(res => {
            if (res.code === 200) {
              this.getFileData(); //  刷新文件列表
              this.dialogMoveFile.visible = false; //  关闭对话框
              this.operationFileList = [];
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          //  单文件移动
          moveFile({
            id: this.operationFile.id, //文件id
            file_name: this.operationFile.file_name, //  文件名称
            file_url: this.selectFilePath //  目标路径
          }).then(res => {
            // console.log(res);
            if (res.code === 200) {
              this.getFileData(); //  刷新文件列表
              this.dialogMoveFile.visible = false; //  关闭对话框
            } else {
              this.$message.error(res.message);
            }
          });
        }
      },
// 新建文件夹对话框 - 提交按钮
      handleAddFolderSubmit() {
        this.$refs.addFolderForm.validate(valid => {
          if (valid) {
            this.addFolderDialog.loading = true; //  对话框的确定按钮打开loading状态
            // 表单校验通过 - 调用新建文件夹接口
            makerDir({
              fileName: this.addFolderForm.name,
              filePath: this.filePath //  文件路径
              // IsDir: 1 //  是否为文件夹：1 表示文件夹 0 表示文件
            }).then(
              resp => {
                this.addFolderDialog.loading = false; //  对话框的确定按钮关闭loading状态
                if (resp.code === 200) {
                  this.addFolderDialog.visible = false; //  关闭对话框
                  this.getFileData (); // 重新获取文件列表
                } else {
                  this.$message.warning(resp.message);
                }
              },
              error => {
                this.addFolderDialog.loading = false; //  对话框的确定按钮关闭loading状态
                console.log(error);
              }
            );
          } else {
            return false;
          }
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .home {
    // 使用flex布局 菜单居左固定宽度 右侧内容区域自适应宽度
    // background-color: #eef0f4;
    display: flex;
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;

    .home-left {
      box-sizing: border-box;
    }

    .home-right {
      box-sizing: border-box;
      width: calc(100vh - 220px);
      padding-left : 20px;
      padding-right : 20px;
      flex: 1;

      .operation-wrapper {
        padding-top: 10px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        // 左侧菜单按钮组 样式调整
        /*>>> .operation-menu-wrapper {
          flex: 1;
        }*/
      }
      .right-main{
        border-top-right-radius: 15px;
        border-top-left-radius: 15px;
        padding: 0px 10px;
        background-color: white;
        /*max-height: calc(100vh - 84px);*/
        /*overflow: hidden;*/
      }
      .table-data{
        max-height: calc(100vh - 250px);
        overflow: auto;
      }
    }
  }
</style>
