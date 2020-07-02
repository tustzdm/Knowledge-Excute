<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
        >
          Core Docs
        </a>
      </li>
      <li>
        <a
          href="https://forum.vuejs.org"
          target="_blank"
        >
          Forum
        </a>
      </li>
      <li>
        <a
          href="https://chat.vuejs.org"
          target="_blank"
        >
          Community Chat
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com/vuejs"
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li>
        <a
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li>
        <a
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted(){
    this.initPixi();
    // let type = "WebGL"
    // if(!this.PIXI.utils.isWebGLSupported()){
    //   type = "canvas"
    // }
    // this.PIXI.utils.sayHello(type);


    // const {PIXI} = this;
    // console.log(PIXI, 'this.PIIIIICXXXX');


    // let app = new PIXI.Application({
    //     width: 256,
    //     height: 256,
    //     antialias: true,
    //     transparent: false,
    //     resolution: 1
    //   }
    // );
    // document.body.appendChild(app.view);
    // let loader = PIXI.Loader.shared;
    // loader.add('/images/p_bg.png').load(setup());

    // app.stage.addChild(PIXI.Sprite.from('/images/p_bg.png'));
    // console.log(Loader,'loader');
    // Loader.add("../assets/logo.png").load(setup);
    // function setup() {
    //   let cat = new Sprite(Loader.resources["../assets/logo.png"].texture);
    //   app.stage.addChild(cat);
    // }
  },
  methods: {
    initPixi() {
      this.app = new this.PIXI.Application({
        width: 512, //default:800
        height: 512, //default:600
        antialias: true, //default:false
        transparent: false, //default:false
        resolution: 1, //default:1
        backgroundColor: 0x000000,
        autoDensity: true
      });
      // 读取到纹理缓存
      let atlas = ["/images/demo.json", "/images/p_tutu-02.png", "/images/star.png"];
      let loader = this.PIXI.Loader.shared;
      loader.add(atlas).load(this.setup);

      // 将这个应用对象元素添加到dom文档中
      document.body.appendChild(this.app.view);
    },
    setup() {
      // 直接从图片生成精灵
      // let sprite = new PIXI.Sprite.from("/images/cat.png");
      // this.app.stage.addChild(sprite);

      //从纹理中创建一个精灵
      let textureCache = this.PIXI.utils.TextureCache;
      console.log(textureCache);
      let texture = textureCache["/images/p_tutu-02.png"];
      let sprite = new this.PIXI.Sprite(texture);
      // 将精灵添加到舞台中
      this.app.stage.addChild(sprite);
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
