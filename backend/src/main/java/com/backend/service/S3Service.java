package com.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.Date;
import java.util.UUID;

@Service
public class S3Service {

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
    private final String DIARY_IMAGE_FOLDER = "diaryImage/";
    private static final Duration PRESIGNED_URL_EXPIRATION = Duration.ofHours(1);

    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String uniqueFileName = DIARY_IMAGE_FOLDER+UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        amazonS3.putObject(bucketName, uniqueFileName, file.getInputStream(), metadata);

        return amazonS3.getUrl(bucketName, uniqueFileName).toString();
    }

    public String createPresignedGetUrl(String fileUrl) {
        if (!hasText(fileUrl)) {
            return fileUrl;
        }

        try {
            String objectKey = extractObjectKey(fileUrl);
            Date expiration = new Date(System.currentTimeMillis() + PRESIGNED_URL_EXPIRATION.toMillis());
            GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, objectKey)
                    .withMethod(HttpMethod.GET)
                    .withExpiration(expiration);

            return amazonS3.generatePresignedUrl(request).toString();
        } catch (RuntimeException e) {
            return fileUrl;
        }
    }

    private String extractObjectKey(String fileUrl) {
        URI uri = URI.create(fileUrl);
        String path = uri.getPath();
        String objectKey = path.startsWith("/") ? path.substring(1) : path;

        if (objectKey.startsWith(bucketName + "/")) {
            return objectKey.substring(bucketName.length() + 1);
        }

        return objectKey;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
