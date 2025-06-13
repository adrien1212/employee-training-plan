// components/PdfUploader.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Text, useToast, List, ListItem, Spinner, Divider, Button, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, HStack
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { FiTrash2 } from 'react-icons/fi';
import api from '../service/api';

interface PdfUploaderProps {
  trainingId: string;
  onUploadSuccess?: (fileName: string) => void;
}

interface TrainingDocument {
  id: string;
  filename: string;
  uploadedAt: string;
  uploadedByUserId: number;
  size: number;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ trainingId, onUploadSuccess }) => {
  const toast = useToast();
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<TrainingDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFilename, setPreviewFilename] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await api.get<TrainingDocument[]>(`/v1/trainings/${trainingId}/documents`);
      setDocuments(res.data);
    } catch {
      toast({
        title: 'Error loading documents.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoadingDocs(false);
    }
  }, [trainingId, toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file || !trainingId) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        setUploading(true);
        await api.post(`/v1/trainings/${trainingId}/documents`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setUploadedFileName(file.name);
        toast({
          title: 'PDF uploaded successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        onUploadSuccess?.(file.name);
        fetchDocuments();
      } catch {
        toast({
          title: 'Upload failed.',
          description: 'Could not upload PDF file.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setUploading(false);
      }
    },
    [trainingId, toast, onUploadSuccess, fetchDocuments]
  );

  const previewDocument = async (docId: string, filename: string) => {
    try {
      const response = await api.get(
        `/v1/trainings/${trainingId}/documents/${docId}/download`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      setPreviewUrl(blobUrl);
      setPreviewFilename(filename);
      setModalOpen(true);
    } catch {
      toast({
        title: 'Preview failed',
        description: 'Unable to preview this file.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const deleteDocument = async (docId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await api.delete(`/v1/trainings/${trainingId}/documents/${docId}`);
      toast({
        title: 'Document deleted',
        status: 'success',
        duration: 3000,
      });
      fetchDocuments();
    } catch {
      toast({
        title: 'Deletion failed',
        description: 'Could not delete the document.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  return (
    <>
      <Box
        {...getRootProps()}
        border="2px dashed teal"
        p={6}
        w="100%"
        textAlign="center"
        borderRadius="md"
        bg={isDragActive ? 'teal.50' : 'gray.50'}
        cursor="pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text>Drop the PDF file here...</Text>
        ) : (
          <Text>Drag & drop a PDF file here, or click to select one</Text>
        )}
        {uploadedFileName && (
          <Text fontSize="sm" color="green.600" mt={2}>
            Uploaded: {uploadedFileName}
          </Text>
        )}
        {isUploading && <Spinner mt={2} />}
      </Box>

      <Divider my={4} />

      <Text fontWeight="bold" mb={2}>Uploaded Documents:</Text>
      {loadingDocs ? (
        <Spinner />
      ) : documents.length === 0 ? (
        <Text>No documents yet.</Text>
      ) : (
        <List spacing={3}>
          {documents.map((doc) => (
            <ListItem key={doc.id}>
              <HStack justify="space-between">
                <Box>
                  <Button
                    variant="link"
                    colorScheme="teal"
                    onClick={() => previewDocument(doc.id, doc.filename)}
                  >
                    {doc.filename}
                  </Button>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(doc.uploadedAt).toLocaleString()} by {doc.uploadedByUserId}
                  </Text>
                </Box>
                <IconButton
                  aria-label="Delete document"
                  icon={<FiTrash2 />}
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteDocument(doc.id)}
                />
              </HStack>
            </ListItem>
          ))}
        </List>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{previewFilename}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {previewUrl && (
              <iframe
                src={previewUrl}
                width="100%"
                height="600px"
                title="PDF Preview"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={() => {
                if (previewUrl && previewFilename) {
                  const link = document.createElement('a');
                  link.href = previewUrl;
                  link.download = previewFilename;
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                }
              }}
            >
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PdfUploader;
