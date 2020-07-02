<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    let type = "WebGL"
    if(!this.PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }
    this.PIXI.utils.sayHello(type)

    this.initPixi();
  },
  methods: {
    initPixi(){
      this.app = new this.PIXI.Application({
        width: 512, //default:800
        height: 512, //default:600
        antialias: true, //default:false
        transparent: false, //default:false
        resolution: 1, //default:1
        backgroundColor: 0x000000,
        autoDensity: true
      });

      document.body.appendChild(this.app.view);
      let sprite = this.PIXI.Sprite.from('images/p_option1.png');
      sprite.position.set(100, 100)
      sprite.scale.x = .5;
      sprite.scale.y = .5;
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
      // sprite.anchor.set(100, 100)
      // sprite.pivot.set(0, 0);
      this.app.stage.addChild(sprite);

      // 使用Pixi的ticker。这被称为 游戏循环
      this.app.ticker.add(() =>{
        sprite.x += 1;
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
