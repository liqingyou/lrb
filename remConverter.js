import fs from 'fs';

// 读取文件内容
const filePath = 'E:\\develop\\js\\vuejs\\vue3\\little-red\\little-red\\src\\pages\\message\\chat\\ChatDetail.vue'; // 修改为你的文件路径

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // 匹配和替换 rem 数值
    const updatedContent = data.replace(/(\d*\.?\d+)rem/g, (match, p1) => {
        const value = parseFloat(p1);
        const newValue = value / 16;
        return `${newValue}rem`;
    });

    // 写回文件
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('文件已成功更新');
    });
});
