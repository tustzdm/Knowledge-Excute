
let Circuit = require('./circuit')
cc.Class({
    extends: cc.Component,

    properties: {
        nodeArea: {
            default: null,
            type: cc.Node
        },
        linePrefab: {
            default: null,
            type: cc.Prefab
        },
        lineArea: {
            default: null,
            type: cc.Node
        },
        limitDist: {
            default: 100,
            tooltip: '连线距离阈值'
        }
    },
    /**
     * 获取某坐标最近的节点name（区分正负/左右）且距离节点距离小于一个阈值
     */
    getNearNode(pos) {
        let minDist = Infinity
        let minNode = null
        let tempDist = 0
        let nodeSpacePos = this.nodeArea.convertToNodeSpaceAR(pos)
        this.nodeArea.children.forEach(node => {
            tempDist = nodeSpacePos.sub(cc.v2(node.x, node.y)).mag()
            if (tempDist < minDist) {
                minDist = tempDist
                minNode = node
            }
        })
        if (minDist > this.limitDist) {
            // 点击距离超出阈值则返回Null
            return null
        }

        // 判断距离节点的左端点近还是右端点近
        let leftDist = cc.v2(minNode.x - minNode.width / 2, minNode.y).sub(nodeSpacePos).mag()
        let rightDist = cc.v2(minNode.x + minNode.width / 2, minNode.y).sub(nodeSpacePos).mag()

        // 手动令battery正负极颠倒
        if (leftDist > rightDist) {
            return { 'name': minNode.name, 'polarity': minNode.name === '_battery' ? '-' : '+' }
        } else {
            return { 'name': minNode.name, 'polarity': minNode.name === '_battery' ? '+' : '-' }
        }
    },
    addDrawMouseEvent() {
        let canvas = cc.find('Canvas');
        canvas.on('mousedown', event => {
            // 记录第一个点的位置
            this.recordPos = event.getLocation()
            this.startNode = this.getNearNode(this.recordPos)
            this.draw = true
            cc.log('开始画', this.startNode)
        });
        canvas.on('mouseup', event => {
            // 取最近节点，circuit增加连线
            this.endNode = this.getNearNode(event.getLocation())
            this.draw = false
            // 增加连线逻辑
            if (this.startNode && this.endNode) {
                this.circuit.addEdge(this.startNode.name, this.endNode.name, this.startNode.polarity, this.endNode.polarity)
            }

            console.log(this.circuit)
            cc.log('结束画', this.endNode)
        });
        canvas.on('mousemove', event => {
            if (this.draw) {
                // 记录当前手移动到的点
                this.currentPos = event.getLocation()
                // 求两点之间的距离
                let subV = this.currentPos.sub(this.recordPos)
                let lenV = subV.mag()
                // cc.log('长度2', lenV)
                // 如果距离大于一定值，这里的5是预制体的width
                // 给定方向向量
                let tempVec = cc.v2(1, 0)
                // 求两点的方向角度
                let rotateV = subV.signAngle(tempVec) / Math.PI * 180
                // 创建预制体
                let line = cc.instantiate(this.linePrefab)
                line.signAngle = rotateV
                line.parent = this.lineArea
                // 这一步是为了防止两个线段之间出现空隙，动态改变预制体的长度
                line.setPosition(this.node.convertToNodeSpaceAR(this.currentPos))
                line.width = lenV
                // 将此时的触摸点设为记录点
                this.recordPos = this.currentPos
            }
        });
    },

    // 点击结束按钮判断电路通路,并激活通路
    finishLink() {
        this.circuit.travel().then(result => {
            // 激活通路
            result.accessRoad.forEach(road => {
                let tempRoad = road.filter(item => item !== '_battery')
                let accessProps = this.calculatePower(tempRoad)     // 计算通路上的节点的电压、电流、功率
                tempRoad.forEach(node => {
                    this.circuit.modifyVertex(node, { active: true })
                    this.showAccessEffect(node, this.turnPower2Color(accessProps.get(node).W))
                })
            })
            // 标红接反节点
            result.reverseVertex.forEach(vertex => {
                this.showReverseEffect(vertex)
            })
            this.circuit.addVertex()
            // TODO 损坏器件  短路器件
        })
    },

    /**
     * 换算功率到颜色
     * TODO: 数据结构中应添加额定功率，用额定功率和实际功率计算颜色
     * y = 1 - 1 / [2 * (x + 1)]
     * @param {*} power
     */
    turnPower2Color(power) {
        let ratio = 1 - 1 / (2 * (power + 1))
        return cc.Color.BLACK.lerp(cc.color(255, 232, 0), ratio)
    },

    // 显示元器件的特效 如灯泡发光
    showAccessEffect(nodeName, color) {
        if (nodeName.includes('light')) {
            let node = this.nodeArea.children.find(item => item.name === nodeName)
            node.color = color

        }
    },

    // 显示接反元器件特效
    showReverseEffect(nodeName) {
        this.nodeArea.children.find(item => item.name === nodeName).color = cc.Color.RED
    },

    /**
     * 计算功率
     * 根据高中物理学基本公式：U = I * R
     * W = U * I
     * Uk / U总 = Rk / R总
     * @param {Array} nodeArr 通路节点数组
     * @returns {Map} res 对应节点的电阻、电压、电流、功率值 key=nodeName value = {R,U,I,W}
     */
    calculatePower(nodeArr) {
        if (!nodeArr instanceof Array) {
            return false
        }
        let props = nodeArr.map(node => { return this.circuit.props.get(node) }) // 取待计算节点的属性数组
        let totalVoltage = this.circuit.props.get('_battery').value         // 获取电池电压
        let totalR = 0
        props.forEach(nodeProp => totalR += nodeProp.value)
        let res = new Map()
        let U = 0
        let I = totalVoltage / totalR   // 同一通路电流相同
        props.forEach(nodeProp => {        // 计算节点电压、电流、功率
            U = nodeProp.value * totalVoltage / totalR
            res.set(nodeProp.name, { 'R': nodeProp.value, 'U': U, 'I': I, 'W': I * U })
        })
        return res
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.addDrawMouseEvent()
        this.circuit = new Circuit()
        this.circuit.addVertex('light1')
        this.circuit.addVertex('light2')
        this.circuit.addVertex('light3')
        this.circuit.addVertex('dianzu')
        this.draw = false
    },

    start() {

    },

    // update (dt) {},
});
