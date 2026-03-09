import {useState} from 'react';
import type {ChangeEvent} from 'react';
import Button from './Button.test';
import Profile from "../APIs/profile"

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function FileUploader({ onUploadSuccess }: { onUploadSuccess?: () => void } = {}){
    
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>('idle');
    
    const allowedTypes = ["image/png", "image/jpeg"];
    const [fileError, setFileError] = useState<string | null>(null);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const selected = e.target.files[0];
            if (!allowedTypes.includes(selected.type)) {
                setFileError("Only PNG and JPEG files are allowed");
                setFile(null);
                return;
            }
            setFileError(null);
            setFile(selected);
        }
    }

    async function handleFileUpload() {
        if (!file)
            return;

        setStatus("uploading");

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            await Profile.patch("/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setStatus('success');
            onUploadSuccess?.();
        } catch (error) {
            setStatus('error');
        }

    }

    return (
        <>
        <div>
            <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange}/>
            {file && status !== "uploading" &&  <Button onClick={handleFileUpload} text="Upload"/>}

            {status === 'success' && (
                <p>Upload successful</p>
            )}

            {status === 'error' && (
                <p>Upload failed</p>
            )}

            {fileError && (
                <p>{fileError}</p>
            )}

        </div>
        </>
    )
}