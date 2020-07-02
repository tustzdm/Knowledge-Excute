import {h, render} from './vdom'


/*
<div id="xxx" a=1>
    <span style = "color:red"></span>
    我是div
</div>
*/


// {
//     type: 'div',
//     props: {id: 'xxx', a:1},
//     children: [
//         {
//             type: 'span',
//             props:{style: {color: 'red'}},
//             children: [{}]
//         },
//         {
//             type: '',
//             props:'' {},
//             children: [],
//             text: '我是div'
//         }
//     ]
// }

let vnode = h('div', {id:'xxx', a:1, key: 'father'},
                h('span', {style:{color:'red'}}),
                '我是div'
            );
// console.log(vnode);

// render
// 将虚拟节点转换成真实的dom节点，最后插入到app元素中
render(vnode, app);