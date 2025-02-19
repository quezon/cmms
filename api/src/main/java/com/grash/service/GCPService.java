package com.grash.service;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import com.google.cloud.storage.Storage.BlobTargetOption;
import com.google.cloud.storage.Storage.PredefinedAcl;
import com.grash.exception.CustomException;
import com.grash.model.File;
import com.grash.utils.Helper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class GCPService {
    @Value("${gcp.value:#{null}}")
    private String gcpJson;
    @Value("${gcp.json-path:#{null}}")
    private String gcpJsonPath;
    @Value("${gcp.project-id}")
    private String gcpProjectId;
    @Value("${gcp.bucket-name}")
    private String gcpBucketName;
    private Storage storage;
    private static boolean configured = false;

    @PostConstruct
    private void init() {
        if ((gcpJson == null || gcpJson.isEmpty()) && (gcpJsonPath == null || gcpJsonPath.isEmpty())) {
            return;
        }
        Credentials credentials;
        try {
            InputStream is = gcpJson == null ? Files.newInputStream(Paths.get(gcpJsonPath)) :
                    new ByteArrayInputStream(gcpJson.getBytes(StandardCharsets.UTF_8));
            credentials = GoogleCredentials.fromStream(is);
            configured = true;
        } catch (IOException e) {
            throw new CustomException("Wrong credentials", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        storage = StorageOptions.newBuilder()
                .setCredentials(credentials)
                .setProjectId(gcpProjectId)
                .build()
                .getService();
    }

    public String upload(MultipartFile file, String folder) {
        checkIfConfigured();
        Helper helper = new Helper();
        try {
            BlobInfo blobInfo = storage.create(
                    BlobInfo.newBuilder(gcpBucketName,
                            folder + "/" + helper.generateString() + " " + file.getOriginalFilename()).build(), //get
                    // original file name
                    file.getBytes(), // the file
                    BlobTargetOption.predefinedAcl(PredefinedAcl.PUBLIC_READ) // Set file permission
            );
            return blobInfo.getMediaLink(); // Return file url
        } catch (IllegalStateException | IOException e) {
            throw new CustomException(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    public byte[] download(String filePath) {
        checkIfConfigured();
        Blob blob = storage.get(BlobId.of(gcpBucketName, filePath));

        if (blob == null) {
            throw new CustomException("File not found", HttpStatus.NOT_FOUND);
        }
        try {
            return blob.getContent();
        } catch (StorageException e) {
            throw new CustomException("Error retrieving file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public byte[] download(File file) {
        checkIfConfigured();
        URI uri = null;
        try {
            uri = new URI(file.getUrl());
        } catch (URISyntaxException e) {
            throw new CustomException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        String path = uri.getPath();
        String filePath = "company " + file.getCompany().getId() + "/" + path.substring(path.lastIndexOf('/') + 1);
        return download(filePath);
    }

    private void checkIfConfigured() {
        if (!configured)
            throw new CustomException("Google Cloud Storage is not configured. Please define the GCP credentials in " +
                    "the " +
                    "env variables", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
