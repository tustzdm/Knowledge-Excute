/**
 *
 * @param {*} vnode 用户写的虚拟节点
 * @param {*} container 要渲染到哪个容器中
 */

// import createElement from "./h"

export function render(vnode, container) {
    // console.log(vnode, container);
    // 将虚拟节点转化成真实的节点
    let ele = createDomElementFrom(vnode);
    container.appendChild(ele);
}

function createDomElementFrom(vnode) {
    let {type, key, props, children, text} = vnode;

    if (type) {
        // 建立虚拟节点和真实元素的关系，后面用于更新真实dom
        vnode.domElement = document.createElement(type);
        // 根据当前节点的属性，去更新真实的dom元素
        updateProperties(vnode);

    } else { // 文本
        vnode.domElement = document.createTextNode(text );
    }
    return vnode.domElement
}

function updateProperties(newVnode, oldProps = {}) {
    let domElement = newVnode.domElement; // 真实节点的dom元素
    let newProps = newVnode.props; // 虚拟节点的属性

    // 如果old有，新的没有，说明被移除
    for (let oldPropName in oldProps){
        if (!newProps[oldPropName]) {
            delete domElement[oldPropName];
        }
    }
    // 如果old没有，新的有，添加
    for (const newPropName in newProps) {
        domElement[newPropName] = newProps[newPropName];
    }
    // console.log(domElement.a); 这里的属性已经挂上了，只是不会在审查元素里看到
}