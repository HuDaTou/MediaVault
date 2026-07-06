package com.overthinker.cloud.gateway.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.InetSocketAddress;
import java.util.Optional;

/**
 * 全局过滤器：记录所有经过网关的请求和响应信息
 * <p>
 * 无论请求路径是否存在、是否正确，都会打印请求路径、方法、来源IP、
 * 响应状态码等信息到日志和终端。
 * </p>
 *
 * @author overthinker
 * @since 2026-07-06
 */
@Slf4j
@Component
public class RequestLoggingFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String method = request.getMethod() != null ? request.getMethod().name() : "UNKNOWN";
        String path = request.getURI().getPath();
        String query = Optional.ofNullable(request.getURI().getQuery()).orElse("");
        String remoteIp = Optional.ofNullable(request.getRemoteAddress())
                .map(InetSocketAddress::getHostString)
                .orElse("unknown");

        // 打印请求信息到终端和日志
        log.info("网关请求 => [{}] {} 来源IP: {} 查询参数: {}",
                method, path, remoteIp, query.isEmpty() ? "(无)" : query);

        long startTime = System.currentTimeMillis();

        // 继续执行过滤器链，并在响应完成后记录状态
        return chain.filter(exchange)
                .doFinally(signalType -> {
                    HttpStatus statusCode = (HttpStatus) exchange.getResponse().getStatusCode();
                    int status = statusCode != null ? statusCode.value() : 0;
                    long elapsed = System.currentTimeMillis() - startTime;

                    if (status == 404) {
                        log.warn("网关响应 <= [{}] {} 状态码: {} 耗时: {}ms ⚠️ 路径不存在或服务不可达",
                                method, path, status, elapsed);
                    } else if (status >= 400) {
                        log.warn("网关响应 <= [{}] {} 状态码: {} 耗时: {}ms",
                                method, path, status, elapsed);
                    } else {
                        log.info("网关响应 <= [{}] {} 状态码: {} 耗时: {}ms",
                                method, path, status, elapsed);
                    }
                });
    }

    @Override
    public int getOrder() {
        // 在 RemoveInternalHeadersFilter 之后执行（+1），在其他过滤器之前
        return Ordered.HIGHEST_PRECEDENCE + 1;
    }
}
