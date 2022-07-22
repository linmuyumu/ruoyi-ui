// 万联平台工具

import { encrypt, decrypt} from '@/utils/jsencrypt';

// 参数是否为对象
export function isObject(obj) {
  if(typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length){
    return true;
  }
}

// 参数是否为数字
export function isNumber(val) {
  let reg = /^[0-9]+.?[0-9]*$/;
  if (reg.test(val)) {
    return true;
  }
}

// 加密对象
export function encryptObj(obj) {
  if(JSON.stringify(obj) == '') {return '';}
  return encrypt(JSON.stringify(obj));
}

// 解密对象
export function decryptObj(txt) {
  if(isObject(JSON.parse(decrypt(txt)))){
    return JSON.parse(decrypt(txt));
  }else if(isNumber(JSON.parse(decrypt(txt)))){
    return Number(decrypt(txt));
  }
  return decrypt(txt);
}