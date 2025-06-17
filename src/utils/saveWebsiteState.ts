import fs from 'fs';
import path from 'path';
import { EditHistory } from '../types/website';

export const saveWebsiteState = async (editHistory: EditHistory) => {
  try {
    // Create src2 directory if it doesn't exist
    const src2Path = path.join(process.cwd(), 'src2');
    if (!fs.existsSync(src2Path)) {
      fs.mkdirSync(src2Path);
    }

    // Create a timestamp for the backup folder
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(src2Path, `backup-${timestamp}`);
    fs.mkdirSync(backupPath);

    // Save the edit history
    fs.writeFileSync(
      path.join(backupPath, 'edit-history.json'),
      JSON.stringify(editHistory, null, 2)
    );

    // Copy all source files
    const srcPath = path.join(process.cwd(), 'src');
    copyDirectory(srcPath, backupPath);

    return true;
  } catch (error) {
    console.error('Error saving website state:', error);
    return false;
  }
};

const copyDirectory = (src: string, dest: string) => {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}; 