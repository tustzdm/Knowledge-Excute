class Circuit {
    constructor() {
        this.vertices = new Set();  // 用来存放图中的顶点
        this.adjList = new Map();   // 用来存放图中的边,区分正负极 (A->B- A->C+ 则 this.adjList.get('A') === ['B-','C+'])
        this.props = new Map();     // 用于存放顶点属性
        // 添加电源顶点
        this.addVertex('_battery', 'battery', 3);
    }

    /**
    * 向图中添加一个新顶点
    * @param {String} name 名称
    * @param {String} type 元器件类型
    * @param {Number} value 当前值
    * @param {Number} max 最大值
    * @param {Number} min 最小值
    * @param {Number} ratedPower 额定功率
    * @param {Boolean} distinguish 是否区分正负极，true为区分正负极，默认区分
    * @param {Boolean} active 是否激活（如灯泡发光）
    */
    addVertex(name, type = '', value = 2, max = Infinity, min = 0, distinguish = true, active = false) {
        this.vertices.add(name);
        this.props.set(name,
            {
                'name': name,
                'value': value,
                'type': type,
                'max': max,
                'min': min,
                'distinguish': distinguish,
                'active': active
            }
        );
    }

    /**
     * 向图中添加a和b两个顶点之间的边
     * @param {*} nameA 源点节点名称
     * @param {*} nameB 终点节点名称
     * @param {*} polarityA 源点正负极
     * @param {*} polarityB 终点正负极
     */
    addEdge(nameA, nameB, polarityA = '+', polarityB = '+') {
        if (nameA === nameB) {
            // 禁止回路
            return false;
        }
        let currentAdj = this.adjList.get(nameA + polarityA) instanceof Array ? this.adjList.get(nameA + polarityA) : new Array();
        if (currentAdj.indexOf(nameB + polarityB) !== -1) {
            // 已存在相同边直接返回
            return false;
        }
        currentAdj.push(nameB + polarityB);
        this.adjList.set(nameA + polarityA, currentAdj);
    }

    // 删除一个节点，同时删除所有与该顶点关联的边
    deleteVertex(name) {
        return new Promise((resolve, reject) => {
            if (name === '_battery') {
                // 电源不可删除
                reject('电源不可删除');
            }
            this.vertices.delete(name);
            this.props.delete(name);
            // 删除为源点的边
            this.adjList.delete(name + '+');
            this.adjList.delete(name + '-');
            // 删除为终点的边
            this.adjList.forEach((list, key) => {
                this.adjList.set(key, list.filter(value => {
                    return !(value === name + '+' || value === name + '-');
                }))
            });
            resolve(name);
        })
    }

    /**
     * 删除边，如果带正负号，则只删除指定节点的边.不包含正负号，删除两个极性的边
     * @param {String} nameA
     * @param {String} nameB
     */
    deleteVertex(nameA, nameB) {
        return new Promise((resolve, reject) => {
            if (!edge instanceof Object) {
                reject('参数错误！！');
            }
            let startNode = [];
            let endNode = [];

            // TODO：优化代码
            if (nameA.includes('+') || nameA.includes('-')) {
                startNode.push(nameA);
            } else {
                startNode.push(nameA + '+', nameA + '-');
            }
            if (nameB.includes('+') || nameB.includes('-')) {
                endNode.push(nameB);
            } else {
                endNode.push(nameB + '+', nameB + '-');
            }

            // 开始删除
            startNode.forEach(start => {
                let tempList = this.adjList.get(start)
                endNode.forEach(end => {
                    tempList.splice(tempList.indexOf(end), 1)
                })
                this.adjList.set(start, tempList)
            })

            resolve()
        })
    }

    /**
     * 修改节点属性
     * @param {String} name 节点名称
     * @param {Object} newProp 新属性
     */
    modifyVertex(name, newProp) {
        let oldProp = this.props.get(name);
        for (let key in newProp) {
            oldProp[key] = newProp[key];
        }
        if (name === '_battery') {
            // 电源name,type字段不可修改
            oldProp.type = 'battery'
            oldProp.name = '_battery'
        }
        this.props.set(name, oldProp);
    }

    /**
     * 遍历图，从电源正极出发,深度遍历,电源负极为通路条件，且电源负极永远不会进入已访问节点数组
     * @resolve {Object}    shortVertex: 短路的节点, accessRoad: 通路路径
     */
    travel() {
        return new Promise(resolve => {
            let visited = [];               // 访问过的节点存入visited数组
            let stack = [];                 // 初始化一个栈
            let reverseVertex = [];         // 接反节点数组
            let shortVertex = [];           // 短路节点数组
            let accessRoad = [];            // 通路路径数组（ps:元素也是数组）
            let tempAccessRoad = [];
            stack.push('_battery+');        // 将电池正极压入栈
            while (stack.length > 0) {      // 栈不空，则一直循环
                let v = stack[stack.length - 1];       // 将栈顶取出
                let nodeName = v.substring(0, v.length - 1) // 去除正负号的节点名
                let childArr = this.adjList.get(nodeName + '+')  //孩子节点数组
                visited.push(v)             // 标记顶点已经访问
                tempAccessRoad.push(nodeName)
                if (childArr instanceof Array) {
                    // v节点有连线到其他节点
                    for (let i = 0; i < childArr.length; i++) {
                        let w = childArr[i];
                        nodeName = w.substring(0, w.length - 1) // 更新nodeName
                        if (visited.indexOf(w) === -1) {
                            //如果该顶点未被访问
                            if (i === childArr.length - 1) {
                                stack.pop()// 孩子节点都被访问过了 出栈
                            }
                            if (this.judgePolarity(w)) {
                                // 出现极性接反
                                reverseVertex.push(nodeName);
                                break;
                            }
                            if (w === '_battery-') {
                                // 到达电源负极，该路线为通路，生成访问路径
                                console.log('access')
                                accessRoad.push([...tempAccessRoad, '_battery'])
                                tempAccessRoad = []
                            } else {
                                stack.push(w);         //将该顶点压入栈
                            }
                            break;
                        }
                    }
                }
            }
            resolve({ 'shortVertex': shortVertex, 'accessRoad': accessRoad, 'reverseVertex': reverseVertex })
        })
    }

    /**
     * 判断极性是否接反
     * @param {String} name 节点名称
     */
    judgePolarity(name) {
        let prop = this.props.get(name.substring(0, name.length - 1))
        // 某器件需要判断极性，且接入节点不为负极 则返回true表示接反
        if (!prop.distinguish) {
            return false;
        } else {
            if (!name.includes('-')) {
                return true;
            }
        }
        return false;
    }
}

export default Circuit;



/* let circuit = new Circuit()
circuit.addVertex('A')
circuit.addVertex('B')
circuit.addVertex('C')

circuit.addEdge('_battery', 'A', '+', '-')
circuit.addEdge('A', 'B', '+', '-')
circuit.addEdge('B', '_battery', '+', '-')

circuit.addEdge('_battery', 'C', '+', '-')
circuit.addEdge('C', '_battery', '+', '-')

circuit.travel().then(res => { console.log(res) }) */