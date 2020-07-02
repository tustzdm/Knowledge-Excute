export function vnode(type, key, props, children, text = undefined) {
    return {
        type,
        props,
        key,
        children,
        text
    }
}