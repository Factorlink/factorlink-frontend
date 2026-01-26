// Tamaño máximo permitido (10MB en bytes)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Tipos MIME permitidos
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
];

// Extensiones permitidas
export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];

// Validar tamaño de archivo
export const validateFileSize = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    return { 
      valid: false, 
      error: `El archivo excede el tamaño máximo de ${maxSizeMB}MB` 
    };
  }
  return { valid: true };
};

// Validar extensión
export const validateFileExtension = (fileName: string): { valid: boolean; error?: string } => {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { 
      valid: false, 
      error: `Extensión no permitida. Use: ${ALLOWED_EXTENSIONS.join(', ')}` 
    };
  }
  return { valid: true };
};

// Validar tipo MIME
export const validateMimeType = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Tipo de archivo no permitido' 
    };
  }
  return { valid: true };
};

// Validación completa del archivo
export const validateFile = (file: File): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  const sizeCheck = validateFileSize(file);
  if (!sizeCheck.valid && sizeCheck.error) errors.push(sizeCheck.error);
  
  const extensionCheck = validateFileExtension(file.name);
  if (!extensionCheck.valid && extensionCheck.error) errors.push(extensionCheck.error);
  
  const mimeCheck = validateMimeType(file);
  if (!mimeCheck.valid && mimeCheck.error) errors.push(mimeCheck.error);
  
  return { valid: errors.length === 0, errors };
};

// Formatear tamaño de archivo para mostrar
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
