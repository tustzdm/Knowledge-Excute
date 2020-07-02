function qichuang() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('起床完毕');
            resolve('起床promise完成')
        }, 1000);
    });
}

function chuanyi() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('穿衣完毕');
        }, 1000);
    });
}

function zaoshang() {
    let qi= qichuang();
    qi.then(() => {
        console.log('222');
        chuanyi();
    });
    return qi;
}

function test() {
    let testPromise = Promise.resolve();
    testPromise = qichuang();
    qichuang().then(() => {
        console.log('222');
        chuanyi();
    });
}

test();