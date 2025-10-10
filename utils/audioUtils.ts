// Converts a Blob object into a base64 encoded string
export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            const result = reader.result as string;
            // The result includes the data URL prefix (e.g., "data:audio/webm;base64,"),
            // which needs to be removed before sending to the API.
            const base64Data = result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = error => reject(error);
    });
};
