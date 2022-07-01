import { Toast } from 'antd-mobile'

// 1.数组随机函数
export function shuffle(arr) {
    const shuffleArr = [...arr]
    for (let i = arr.length - 1; i > 0; i--) {
        const randomPos = Math.floor(Math.random() * i)
        const temp = shuffleArr[i]
        shuffleArr[i] = shuffleArr[randomPos]
        shuffleArr[randomPos] = temp
    }
    return shuffleArr
}

// 2.秒 -> 00:00
export function playTimeFormat(seconds) {
    const quotient = new String(Math.floor(seconds / 60)).padStart(2, '0')
    const remainder = new String(Math.floor(seconds % 60)).padStart(2, '0')
    return `${quotient}:${remainder}`
}

// 3.文件下载
export function download(filePath, fileName) {
    fetch(filePath)
        .then(res => res.blob(), err1 => {
            console.log(err1);
            Toast.show({ content: '下载出错', duration: 1000 })
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.download = fileName ? fileName : filePath
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        }, err2 => {
            console.log(err2);
            Toast.show({ content: '下载出错', duration: 1000 })
        })
}

// 4.长数字 -> 带单位
export function longNumberConvert(playCount) {
    return playCount > 100000000 ? (playCount / 100000000).toFixed(0) + "亿"
        : playCount > 10000 ? (playCount / 10000).toFixed(0) + "万"
            : playCount;
};

// 5.获取字符串文本的宽度
export function getTextWidth(text, fontSize) {
    // 创建临时元素
    const _span = document.createElement('span')
    // 放入文本
    _span.innerText = text
    // 设置文字大小
    _span.style.fontSize = fontSize + 'px'
    // span元素转块级
    _span.style.position = 'absolute'
    // span放入body中
    document.body.appendChild(_span)
    // 获取span的宽度
    let width = _span.getBoundingClientRect().width
    // 从body中删除该span
    document.body.removeChild(_span)
    // 返回span宽度
    return width
}
