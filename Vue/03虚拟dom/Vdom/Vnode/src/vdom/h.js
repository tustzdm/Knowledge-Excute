/**
 *
 * @param {*} type 类型
 * @param {*} props 所有属性，key不属于props内
 * @param  {...any} children 子元素
 */
import {vnode} from './vnode'
export default function createElement(type, props, ...children) {
    let key;
    if (props.key) {
        key = props.key;
        delete props.key;
    }

    // 将不是虚拟节点的子节点，变成虚拟节点
    children = children.map(child => {
        if (typeof child === 'string') {
            return vnode(undefined, undefined, undefined, undefined, child);
        } else {
            return child
        }
    });
    return vnode(type, key, props, children);
}
