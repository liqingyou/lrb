// 模拟接口请求时间
const delay = (t) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, t);
    });
};

const exploreCardsMock = async (nums = 20) => {
    await delay(1000);
    return new Array(nums).fill(1).map((a, i) => {
        let r = Math.random(); // [0,1]
        r = Math.floor(r * 9) + 1; // [1,9]

        let isVideo = Math.random() < 0.5;
        let imageList = undefined;
        let videoUrl = undefined;

        if (isVideo) {
            let n = Math.floor(Math.random() * 20) + 1; // 1-20
            videoUrl = [`src/mock/source/第${n}集.mp4`];
            imageList = [`src/mock/source/第${n}集-poster.jpg`];
        } else {
            let n = Math.floor(Math.random() * 5) + 1; // 1-5
            imageList = new Array(n).fill(0).map(() => {
                let m = Math.floor(Math.random() * 10) + 1; // 1 -10
                return `src/mock/source/第${m}集-poster.jpg`;
            });
        }

        return {
            id: i,
            isVideo: isVideo,
            imageUrl: imageList,
            videoUrl: videoUrl,
            content:
                r % 2 !== 0
                    ? "我是谁? 我是第" + ((videoUrl && videoUrl.length > 0) ? videoUrl[0] : '0') + "集  #白展堂 #武林外传"
                    : "你的队伍开过来, 像一阵绿旋风. #歌曲",
            avatar: "src/mock/images/h0" + r + ".jpg",
            author: "TheHuang" + r,
            title: "我是标题" + r,
            tag: "标签" + r,
            likeCount: Math.floor(Math.random() * 1000),
        };
    });
};

export {exploreCardsMock};
