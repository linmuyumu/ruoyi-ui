import request from '@/utils/request'

// 左侧菜单选择的为 全部 时，根据路径，获取文件列表
export function getFileList(query) {
  return request({
    url: '/minio/list',
    method: 'get',
    params: query
  })
}

// 模糊查询
export function getFileByName(query) {
  return request({
    url: '/minio/list/search',
    method: 'get',
    params: query
  })
}

// 创建文件夹
export function makerDir(data) {
  return request({
    url: '/minio/mkDir',
    method: 'post',
    data: data
  })
}

// 下载文件
export function downLoadFile(fileName) {
  return request({
    url: `/minio/download/${fileName}`,
    method: 'post'
  })
}

// 获取文件夹列表 树状结构
export function getFileTree(query) {
  return request({
    url: '/minio/getTree',
    method: 'get',
    params: query
  })
}

// 文件移动
export function moveFile(data) {
  return request({
    url: '/minio/move',
    method: 'post',
    data: data
  })
}

// 重命名文件
export function renameFile(data) {
  return request({
    url: '/minio/rename',
    method: 'post',
    data: data
  })
}

// 批量删除文件
export function batchDeleteFile(data) {
  return request({
    url: '/minio/delete/Batch',
    method: 'post',
    data: data
  })
}

// 批量移动文件
export function batchMoveFile(data) {
  return request({
    url: '/minio/move/Batch',
    method: 'post',
    data: data
  })
}
//
// // 左侧菜单选择的为 除全部以外 的类型时，根据类型，获取文件列表
// export function getFileListByType() {
//   return request({
//     url: '/minio/list/type',
//     method: 'get'
//   })
// }
//
// // 新建文件
// export function createFile(data) {
//   return request({
//     url: '/minio/create',
//     method: 'post',
//     data: data
//   })
// }
//
//
// // 获取存储空间已占用大小
// export function getFileStorage(query) {
//   return request({
//     url: '/admin/getStorage',
//     method: 'get',
//     params: query
//   })
// }
//
//

//
//
// // 删除文件
// export function deleteFile(data) {
//   return request({
//     url: '/minio/delete',
//     method: 'post',
//     data: data
//   })
// }
//
//

//
// // 清空回收站
// export function getEmptyTrash(query) {
//   return request({
//     url: '/minio/mkDir',
//     method: 'get',
//     params: query
//   })
// }
//
// // 还原回收站文件
// export function getRestoreTrash(query) {
//   return request({
//     url: '/minio/RestoreTrash',
//     method: 'get',
//     params: query
//   })
// }
//
// // 批量彻底删除文件
// export function batchEmptyFile(data) {
//   return request({
//     url: '/minio/Empty/Batch',
//     method: 'post',
//     data: data
//   })
// }
//
// // 批量还原文件
// export function batchRestoreFile(data) {
//   return request({
//     url: '/minio/Restore/Batch',
//     method: 'post',
//     data: data
//   })
// }
//
// // 获取分片上传端口
// export function getUpFile(query) {
//   return request({
//     url: '/file/upload/createMultipartUpload',
//     method: 'get',
//     params: query
//   })
// }
//
// // 上传完成后申请合并
// export function getMultipartUpload(query) {
//   return request({
//     url: '/file/upload/completeMultipartUpload',
//     method: 'get',
//     params: query
//   })
// }
//
// // 文本文件展示
// export function getFilePreview(query) {
//   return request({
//     url: '/object/preview/txt',
//     method: 'get',
//     params: query
//   })
// }
//
// // 获取图片链接
// export function getImage(query) {
//   return request({
//     url: '/show/images',
//     method: 'get',
//     params: query
//   })
// }
//
