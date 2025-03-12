import { Platform } from "react-native";

export const uriToBlob = async (uri) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        console.log("📂 File converted to Blob:", blob);
        return blob;
    } catch (error) {
        console.error("⚠️ Error converting file:", error);
        return null;
    }
};

export const getIconColor = (type: string) => {
    switch (type) {
        case 'image':
            return 'red';
        case 'video':
            return 'black';
        case 'audio':
            return 'green';
        case 'document':
            return 'orange';
        case 'gallery':
            return 'purple';
        case 'camera':
            return 'blue';
        default:
            return 'gray'; // Default color
    }
};

export const getAdjustedUri = (image) => {
    return Platform.OS === 'android' ? image?.uri : image?.uri.replace('file://', '');
}