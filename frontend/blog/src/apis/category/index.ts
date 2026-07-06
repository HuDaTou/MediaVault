import http from "@/utils/http.ts";

// 查询分类列表
export function categoryList() {
    return http.get("/service-web/category/list", {
        method: "get"
    });
}