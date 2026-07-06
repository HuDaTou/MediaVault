import http from "@/utils/http.ts";

// 获取视频列表
export function getVideoList(pageNum: Number, pageSize: Number) {
    return http({
        url: '/service-web/video/list',
        method: 'get',
        params: {
            pageNum,
            pageSize
        }
    })
}

