cc.Class({
    extends: cc.Component,

    properties: {
        pencilColor: {
            default: new cc.Color(),
            tooltip: '画笔颜色'
        },
        drawNode: {
            default: null,
            type: cc.Node,
            tooltip: '画板节点'
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    start: function () {
        this.initScript();
    },

    // called every frame
    update: function (dt) {

    },

    initScript() {
        this.pencilInit();
        this.touchStart(this.drawNode);
        this.touchMove(this.drawNode);
        this.touchEnd(this.drawNode);
        this.touchCancel(this.drawNode);
    },

    pencilInit() {
        // 画笔初始化
        let graphicsNode = new cc.Node();
        graphicsNode.scale = 1.66666666666;
        this.ctx = graphicsNode.addComponent(cc.Graphics);
        //控制线的尾端是圆角，
        this.ctx.lineJoin = cc.Graphics.LineJoin.ROUND;
        this.ctx.lineCap = cc.Graphics.LineCap.ROUND;
        this.ctx.lineWidth = 6;
        this.ctx.strokeColor = new cc.Color(
            this.pencilColor.r,
            this.pencilColor.g,
            this.pencilColor.b,
            this.pencilColor.a
        );
        this.drawNode.addChild(graphicsNode);
    },

    touchStart(node) {
        // 画笔开始事件监听
        let that = this;
        let currentStartPos;
        let startX;
        let startY;
        node.on(cc.Node.EventType.TOUCH_START, e => {
            if (this.isMove) {
                return;
            }
            // 记录起点
            currentStartPos = this.drawNode.convertToNodeSpaceAR(cc.v2(e.getLocation().x, e.getLocation().y));
            startX = Number.parseInt(currentStartPos.x * 0.6, 10);
            startY = Number.parseInt(currentStartPos.y * 0.6, 10);
            this.startX = startX;
            this.startY = startY;
            that.ctx.moveTo(startX, startY);
        });
    },
    touchMove(node) {
        // 画笔移动事件监听
        let that = this;
        let moveX;
        let moveY;
        let currentMovePos;
        let currentLine;
        that.ctx.moveTo(this.startX, this.startY);
        node.on(cc.Node.EventType.TOUCH_MOVE, e => {
            this.isMove = true;
            // 清除所有
            // that.ctx.clear();
            // 绘制已存在的线段
            // if (this.lines.length >= 1) {
            //     for (let i = 0; i < this.lines.length; i++) {
            //         currentLine = this.lines[i];
            //         that.ctx.moveTo(currentLine.startX, currentLine.startY);
            //         that.ctx.lineTo(currentLine.endX, currentLine.endY);
            //     }
            // }

            // that.ctx.moveTo(e.target.x, e.target.y);
            // cc.log('重新定位起始',e.target.x,e.target.x);
            currentMovePos = this.drawNode.convertToNodeSpaceAR(cc.v2(e.getLocation().x, e.getLocation().y));
            // that.ctx.moveTo(currentMovePos.x, currentMovePos.y);
            this.currentMovePos = currentMovePos;
            moveX = Number.parseInt(currentMovePos.x * 0.6, 10);
            moveY = Number.parseInt(currentMovePos.y * 0.6, 10);
            // 范围设置
            if (moveX >= 576) {
                moveX = 576;
            } else if (moveX <= -576) {
                moveX = -576;
            }
            // 记录当前终点
            this.endX = moveX;
            this.endY = moveY;
            // 绘制
            that.ctx.lineTo(moveX, moveY);
            // that.ctx.moveTo(moveX, moveY);
            that.ctx.stroke();
            that.ctx.moveTo(moveX, moveY)
            cc.log('一次移动完成了');
        });
    },
    touchEnd(node) {
        // 画笔结束事件监听
        // let currentEndPos;
        // let endX;
        // let endY;
        let line;
        node.on(cc.Node.EventType.TOUCH_END, () => {
            if (!this.isMove) {
                return;
            }
            cc.log('touchEnd');
            // 记录本次连线起始点
            line = {
                startX: this.startX,
                startY: this.startY,
                endX: this.endX,
                endY: this.endY
            };
            // this.lines.push(line);
            this.isMove = false;
            // this.judge(line);
        });
    },
    touchCancel(node) {
        // 画笔结束事件监听
        // let currentEndPos;
        // let endX;
        // let endY;
        let line;
        node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            if (!this.isMove) {
                return;
            }
            cc.log('touchCancel');
            line = {
                startX: this.startX,
                startY: this.startY,
                endX: this.endX,
                endY: this.endY
            };
            this.lines.push(line);
            this.isMove = false;
            this.judge(line);
            cc.log('----line-------');
            cc.log(line);
        });
    },
});
