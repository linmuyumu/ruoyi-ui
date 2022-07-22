<template>
  <!-- collapse 属性：控制菜单收缩展开 -->
  <el-menu
    class="side-menu"
    :default-active="activeIndex"
    :router="true"
    :collapse="isCollapse"
    background-color="#fff"
    text-color="#000"
    active-text-color="#2578b5"
  >
    <div class="fold-wrapper">
      <!-- click事件 当点击时切换菜单的收缩状态 -->
      <i
        class="el-icon-s-unfold"
        v-if="isCollapse"
        title="展开"
        @click="isCollapse = false"
      ></i>
      <i
        class="el-icon-s-fold"
        v-else
        title="收缩"
        @click="isCollapse = true"
      ></i>
    </div>
    <el-menu-item
      index="0"
      :route="{ name: 'Upload2', query: { fileType: 0, filePath: '/' } }"
    >
      <i class="el-icon-menu"></i>
      <span slot="title">全部</span>
    </el-menu-item>
    <el-menu-item index="1" :route="{ name: 'Upload2', query: { fileType: 1 } }">
      <i class="el-icon-collection-tag"></i>
      <span slot="title">心脏超声</span>
    </el-menu-item>
    <el-menu-item index="2" :route="{ name: 'Upload2', query: { fileType: 2 } }">
      <i class="el-icon-collection-tag"></i>
      <span slot="title">甲状腺超声</span>
    </el-menu-item>
    <el-menu-item index="3" :route="{ name: 'Upload2', query: { fileType: 3 } }">
      <i class="el-icon-collection-tag"></i>
      <span slot="title">颈动脉超声</span>
    </el-menu-item>
    <el-menu-item index="4" :route="{ name: 'Upload2', query: { fileType: 4 } }">
      <i class="el-icon-collection-tag"></i>
      <span slot="title">血管内超声</span>
    </el-menu-item>
    <el-menu-item index="5" :route="{ name: 'Upload2', query: { fileType: 5 } }">
      <i class="el-icon-collection-tag"></i>
      <span slot="title">病理</span>
    </el-menu-item>
    <el-menu-item index="6" :route="{ name: 'Upload2', query: { fileType: 6 } }">
      <i class="el-icon-collection-tag"></i>
      <span slot="title">胃镜</span>
    </el-menu-item>
    <el-menu-item index="7" :route="{ name: 'Upload2', query: { fileType: 7 } }">
      <i class="el-icon-collection-tag"></i>
      <span slot="title">脑部MRI</span>
    </el-menu-item>

  </el-menu>
</template>

<script>
export default {
  name: "SideMenu",
  props: {
    storageValue: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isCollapse: false, //  控制菜单收缩展开
      storageMaxValue: Math.pow(1024, 3) * 1000, //  默认存储容量，100GB
      //  自定义进度条颜色，不同占比，进度条颜色不同
      storageColor: [
        { color: "#89ea59", percentage: 50 },
        { color: "#eea740", percentage: 80 },
        { color: "#f35050", percentage: 100 }
      ],
    };
  },
  computed: {
    // 当前激活菜单的 index
    activeIndex() {
      return String(this.$route.query.fileType); //  获取当前路由参数中包含的文件类型
    },
    // 存储百分比
    storagePercentage() {
      return (this.storageValue / this.storageMaxValue) * 100;
    }
  },
  watch: {
    // 监听收缩状态变化，存储在sessionStorage中，保证页面刷新时仍然保存设置的状态
    isCollapse(newValue) {
      sessionStorage.setItem("isCollapse", newValue);
    }
  },
  filters: {
    // 计算空间占比
    storageTrans(size, status) {
      const B = 1024;
      const KB = Math.pow(1024, 2);
      const MB = Math.pow(1024, 3);
      const GB = Math.pow(1024, 4);
      if (status) {
        //	截取整数部分
        if (!size) {
          return 0 + "KB";
        } else if (size < KB) {
          return (size / B).toFixed(0) + "KB";
        } else if (size < MB) {
          return (size / KB).toFixed(0) + "MB";
        } else if (size < GB) {
          return (size / MB).toFixed(0) + "GB";
        } else {
          return (size / GB).toFixed(0) + "TB";
        }
      } else {
        if (!size) {
          return 0 + "KB";
        } else if (size < KB) {
          return (size / B).toFixed(0) + "KB";
        } else if (size < MB) {
          return (size / KB).toFixed(2) + "MB";
        } else if (size < GB) {
          return (size / MB).toFixed(3) + "GB";
        } else {
          return (size / GB).toFixed(4) + "TB";
        }
      }
    }
  },
  created() {
    this.isCollapse = sessionStorage.getItem("isCollapse") === "true"; //  读取保存的状态
  },
  methods: {
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/mixins.styl';

.side-menu {
  // 高度设置为屏幕高度减去顶部导航栏的高度
   height: calc(100vh - 86px);
  overflow: auto;
  // 调整滚动条样式
  setScrollbar(6px, #909399, #EBEEF5);

  // 折叠图标调整样式
  .fold-wrapper {
    /*height: 103px;*/
    line-height: 56px;
    padding: 0 20px;
    text-align: right;
    color: #343434;
    font-size: 24px;

    .el-icon-s-unfold, .el-icon-s-fold {
      cursor: pointer;

      &:hover {
        opacity: 0.5;
      }
    }
  }

  // 存储空间展示区
  .storage-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 16px;
    z-index: 2;
    color: #224270;
    opacity: 0.8;

    .text {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }
  }
}

// 对展开状态下的菜单设置宽度
.side-menu:not(.el-menu--collapse) {
  width: 220px;
}
</style>
