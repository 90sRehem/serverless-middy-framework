export interface StorageService {
  saveFile(filePath: string, fileContent: Buffer): Promise<void>;
  getFile(filePath: string): Promise<Buffer>;
}
