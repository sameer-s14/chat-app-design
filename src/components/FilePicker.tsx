import { TouchableOpacity } from "react-native"
import * as DocumentPicker from "expo-document-picker";
import { MIME_TYPES_PATTERN } from "../constants";

export const FilePicker = ({ containerStyle, setFiles, type = MIME_TYPES_PATTERN.IMAGE, children, multiple = false }) => {
    const pickImage = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type,
                copyToCacheDirectory: false,
            });
            if (result.assets && result.assets.length > 0) {
                setFiles(multiple ? result.assets : result?.assets[0]);
            }
        } catch (err) {
            console.log("Error picking image:", err);
        }
    };
    return <TouchableOpacity onPress={pickImage} style={containerStyle}>{children}</TouchableOpacity>
}