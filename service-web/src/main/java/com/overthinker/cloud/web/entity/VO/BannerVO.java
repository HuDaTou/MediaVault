package com.overthinker.cloud.web.entity.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

/**
 * Banner 视图对象
 *
 * @author overH
 * @since 2025-07-09
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class BannerVO {

    private Long id;

    private String url;

    private Long size;

    private String type;

    private Integer sortOrder;

    private String userName;

    private LocalDateTime createTime;
}
