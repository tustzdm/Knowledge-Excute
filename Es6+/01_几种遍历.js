
//  for in遍历的是数组的索引（即键名），而for of遍历的是数组元素值.
    let arr = [1,2,3,4,5,6,7]
    for(let index of arr){
        //   console.log(index)//1 2 3 4 5 6 7

    }
    for(let index in arr){
        // console.log(index)//0 1 2 3 4 5 6
        //console.log(arr)//1 2 3 4 5 6 7
        //console.log(arr[index])
    }

// forEach
// 三个参数，第一个value, 第二个 index, 第三个数组本身。
// 适用于 数组，set，map，不适应于 字符串，Object。
// 无法修改和删除集合数据，效率和for循环相同，不用关心集合下标的返回。
// 不能终止循环，break，continue不能使用。

array.forEach(function(element) {
    console.log(element);
  });

