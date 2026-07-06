import http from "@/utils/http.ts";

// 查询留言板列表
export function getLeaveWordList(id?: any) {
    return http({
        url: '/service-web/leaveWord/list',
        method: 'get',
        params: {
            id
        }
    })
}

// 新增留言板
export function userLeaveWord(content: any) {
    return http.post('/service-web/leaveWord/auth/userLeaveWord',JSON.stringify(content))
}