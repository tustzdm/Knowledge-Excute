function Zhufeng(options = {}){
	this.$options = options;//|将所有属性挂在在了$options
	var data = this._data = this.$options.data;
	observe(data);
	//this 代理了this._data
	for (let key in data) {
		Object.defineProperty(this, key, {
			enumerable:true,
			get(){
				return this._data[key]
			},
			set(newVal){
				this._data[key] = newVal;
			}
		})
	}
	new Compile(options.el,this)
}

function Compile(el,vm){ //获取页面里的el内容
	//el表示替换的内容
	vm.$el = document.querySelector(el);
	let fragment = document.createDocumentFragment();
	
	while(child = vm.$el.firstChild){ //将#app中的内容移入内存中
		fragment.appendChild(child);
	}
	
	function replace(fragment){
		Array.from(fragment.childNodes).forEach(function(node){//循环每一层
			let text = node.textContent;
			let reg = /\{\{(.*)\}\}/;   
			if(node.noetype === 3 && reg.test(text)){
				console.log(RegExp.$1); // a.a vm.b
				let arr = RegExp.$1.split('.');//[a,a]
				let val = vm;
				arr.forEach(function(k){
					val = val[k];
				})
				node.textContent = text.replace(/\{\{(.*)\}\}/, val)
			}
			if(node.childNodes){
				replace(node);
			}
		})
	}
	vm.$el.appendChild(fragment);
}

//观察，给对象增加objectDefineProperty
function Observe(data){ //这里写主要逻辑
	for (let key in data) { //把data属性通过objectDefineProperty的方式定义属性
		let  val = data[key];
		observe(val); //当data[key]还是对象时执行递归！！！
		Object.defineProperty(data,key,{
			enumerable:true, //可遍历
			get(){
				return val;
			},
			set(newVal){ //更改值的时候
				if(newVal === val){
					return
				}
				val = newVal;
				observe(newVal);
			}
		})
	}
}
function observe(data){
	if(typeof(data) !== 'object') return //判断是否仍然是对象，是对象的话继续递归
	return new Observe(data)
}

//vue 不能新增不存在的属性，因为它没有get和set
//深度响应，每次生成新对象会给它增加数据劫持