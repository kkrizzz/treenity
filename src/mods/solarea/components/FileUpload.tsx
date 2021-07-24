import * as React from 'react';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import './FileUpload.css';

interface UploadFileDefault {
  onChangeFile: (file: File, formatted?: string | ArrayBuffer) => any;
  returnFormat: 'file' | 'base64' | 'binary';
  className?: any;
}

export const UploadFile = (props: PropsWithChildren<UploadFileDefault>) => {
  const { children, onChangeFile, returnFormat } = props;
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e) => {
    const targetFile = e.target.files[0];

    if (targetFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (!reader.result) return;
        onChangeFile(targetFile, Buffer.from(reader.result! as string));
      };

      switch (returnFormat) {
        case 'base64':
          reader.readAsDataURL(targetFile);
          break;
        case 'binary':
          reader.readAsBinaryString(targetFile);
          break;
        case 'file':
          onChangeFile(targetFile);
          break;
      }
    }

    setFile(targetFile);
  };

  return (
    <div className={props.className}>
      <input id="file-upload-button" type="file" onChange={(e) => handleChange(e)} />

      <div
        onClick={() => document.getElementById('file-upload-button')?.click()}
        className="files-upload"
      >
        {children}
      </div>
    </div>
  );
};
