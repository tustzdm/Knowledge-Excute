// 如果任何值在数组中出现至少两次，函数返回 true。如果数组中每个元素都不相同，则返回 false。
function (arr) {
	// for(var i = 0; i < arr.length; i++){
	// if(arr.slice(i,arr.length).indexOf(arr[i]) > 0){
	// return false
	// }
	// }
	// return  true;
  
  	let newArr = [...set(arr)];
  	if(newArr.length === arr.length){
    	return false
    }else{
    	return true
    }
}

给定一个数组，里面的元素全部由0和1组成 计算其中最大连续1的个数。
输入: [1,1,0,1,1,1]
输出: 3
解释: 开头的两位和最后的三位都是连续1，所以最大连续1的个数是 3.

function getNumber(arr){
	let result = 0;
  	let count = 0;
  	for(let i = 0 ; i < arr.length ; i++){
      if(arr[i] === 1){
      	count++
      }else{
      	result = count > result? count ：result;
        count = 0;
      }
    }
  	retrun result;
}
        
// 实现一个函数，找出数组中重复次数最多的元素
function findDuplicate(arr) {
	let newArr = [...set(arr)];
    let number = 0;
    let result = arr[0];
    let index 
    let count = 0;
    for(let i = 0 ; i < newArr.length ; i++){
    	    for(let j =0 ;j< arr.length; j++){
      			if(arr[j] === newArr[i]){
       				count = number++ 		
      			}
      		}
        if (count > number){
      		index = i;  	
      	}
        number =0;
    }
    return newArr[index];
}
  