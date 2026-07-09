package com.overthinker.cloud.api.apis.media.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * 文件上传结果视图对象
 * <p>
 * 封装文件上传完成后的返回信息，包括资产ID、对象名称、文件URL等
 * </p>
 *
 * @author overthinker
 * @since 2025-08-02
 */
@Data
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class UploadResultVO {

    /**
     * 是否为秒传（文件已存在，直接复用）
     */
    private Boolean instantUpload;

    /**
     * MinIO存储中的对象名称
     */
    private String objectName;

    /**
     * 媒体资产记录ID
     */
    private Long assetId;

    /**
     * 文件的预签名访问URL
     */
    private String fileUrl;
}
