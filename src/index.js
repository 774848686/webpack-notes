import './index.css';
import './index.less';
import testImg from '../assets/images/test.png'
const testStr = 'zdf';
// 解析es6 + 的高级语法配置
class A{
    a=1
}
console.log([1,2].includes(1))

// 图片的引入 
//  1. js引入
// file-loader 默认会将内部生成一张图片 到dist 目录下
//  2. css引入
//  3. html引入
let image = new Image();
image.src=testImg;
document.body.appendChild(image);