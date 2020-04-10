cc.Class({
    extends: cc.Component,

    properties: {
        onOff: false,
        //电路初始电阻为灯泡的2.5Ω + 滑动变阻器全部值20Ω
        dianzu: 22.5,
        // label: {
        //     default: null,
        //     type: cc.Label
        // },
        // // defaults, set visually when attaching this script to the Canvas
        // text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        // this.label.string = this.text;
        this.initScript();
        this.moveBopian();
    },

    // called every frame
    update: function (dt) {

    },

    initScript() {
        this.on = cc.find('Canvas/dianlu/kaiguan/on');
        this.off = cc.find('Canvas/dianlu/kaiguan/off');
        this.deng = cc.find('Canvas/dianlu/deng');
        this.bopian = cc.find('Canvas/dianlu/bianzuqi/bopian');
        this.zhizhen = cc.find('Canvas/dianlu/zhizhen');
        this.dianliu = cc.find('Canvas/dianlu/dianliu');
        this.dianliuzhi = this.dianliu.getComponent(cc.Label);
        cc.log(this.dianliuzhi);
        cc.log('初始电阻',this.dianzu);
    },

    // onBtnClick(btnName) {
    //     cc.log(btnName);
    //     this.callBack[btnName]();
    // },

    onBtnOnClick() {
        this.on.opacity = 0;
        this.off.opacity = 255;
        // this.on.active = false;
        // this.off.active = true;
        this.onOff = false;
        cc.log('开关关闭了');
        this.fixLight();
    },
    onBtnOffClick() {
        this.on.opacity = 255;
        this.off.opacity = 0;
        // this.on.active = true;
        // this.off.active = false;
        this.onOff = true;
        cc.log('开关打开了');
        this.fixLight();
    },

    //调整的亮度
    fixLight() {
        // let liangdu = this.deng.opacity;
        if (this.onOff) {
            // this.deng.opacity = 100;
            cc.log(this.dianzu);
            this.deng.opacity = 100 + 155*(22.5-this.dianzu)/20;
            this.zhizhen.angle = 26 - 32 * (1 - (this.dianzu - 2.5)/20)
            cc.log('zhizhen',this.zhizhen.angle);
            this.dianliuzhi.string = (3 / this.dianzu).toFixed(2) + 'A';
            cc.log('电流是',this.dianliuzhi.string);
        } else {
            this.deng.opacity = 0;
            this.zhizhen.angle = 32;
            this.dianliuzhi.string = '0A';
            return
        }
    },

    //滑动电阻器拨动
    moveBopian() {
        let that = this;
        this.bopian.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // this.opacity = 255;
            cc.log(event);
            var delta = event.touch.getDelta();
            this.x += delta.x;
            cc.log(delta.x, this.x)
            if (this.x < -330){
                this.x = -330;
            } else if (this.x > -60){
                this.x = -60;
            }
            cc.log(this.x);
            // this.y += delta.y;
            that.setDianzu();
        }, this.bopian);
    },

    //调整电路的整体电阻
    setDianzu() {
        //变阻器默认值和最大值为20
        let bianzuqi = (20 * (270 - this.bopian.x - 330) / 270).toFixed(2);
        this.dianzu = (2.5 + bianzuqi * 1).toFixed(2);
        cc.log('bianzuqi',bianzuqi);
        cc.log('dianzu', this.dianzu);
        this.fixLight();
    }
});
