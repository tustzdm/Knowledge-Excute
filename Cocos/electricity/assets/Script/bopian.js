cc.Class({
    extends: cc.Component,

    properties: {
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
        cc.log(11111);
        cc.log( this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // this.opacity = 255;
            var delta = event.touch.getDelta();
            this.x += delta.x;
            if (this.x < -330){
                this.x = -330;
            } else if (this.x > -60){
                this.x = -60;
            }
            cc.log(this.x);
            // this.y += delta.y;
        }, this.node);
    },

    // called every frame
    update: function (dt) {

    },
});
