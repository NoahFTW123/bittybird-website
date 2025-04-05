import { useState } from "react";
import { storage, db } from '../../services/firebaseConfig.js'; // Firebase config
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import '../../css/admin.css'
import { collection, addDoc } from "firebase/firestore";

function CreateFolderAndUploadPhotos() {
    const [folderName, setFolderName] = useState("");
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [photoUrls, setPhotoUrls] = useState([]); // Store URLs immediately after upload

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files)); // Convert FileList to Array
    };

    const handleUpload = async () => {
        if (!folderName.trim()) return alert("Enter a folder name!");
        if (files.length === 0) return alert("Select photos to upload!");

        setUploading(true);
        const uploadedPhotos = [];

        try {
            // Upload each file and immediately get its URL
            await Promise.all(
                files.map((file) => {
                    return new Promise((resolve, reject) => {
                        const fileRef = ref(storage, `Photos/${folderName}/${Date.now()}_${file.name}`);
                        const uploadTask = uploadBytesResumable(fileRef, file);

                        uploadTask.on(
                            "state_changed",
                            null,
                            reject,
                            async () => {
                                try {
                                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                                    uploadedPhotos.push(url);
                                    setPhotoUrls((prev) => [...prev, url]); // Update UI immediately
                                    resolve();
                                } catch (error) {
                                    reject(error);
                                }
                            }
                        );
                    });
                })
            );

            // Store folder & URLs in Firestore
            await addDoc(collection(db, "folders"), {
                name: folderName,
                images: uploadedPhotos, // Store all URLs
                createdAt: new Date(),
            });

            alert(`Folder '${folderName}' created and photos uploaded!`);
            setFolderName("");
            setFiles([]);
        } catch (error) {
            console.error("Error uploading files:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h2>Create Folder & Upload Photos</h2>
            <input
                type="textarea"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
            />
            <input type="file" multiple onChange={handleFileChange}/>
            <button className="btn" onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Create & Upload"}
            </button>

            {/* Display uploaded photo URLs as a comma-separated list */}
            <div>
                <h2>Uploaded Photo URLs</h2>
                <p className="urls">{photoUrls.join(", ")}</p>
            </div>
        </div>
    );
}

export default CreateFolderAndUploadPhotos;