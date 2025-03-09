import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const DropdownMenu = ({ isGroupAdmin, handleOptionPress }) => {
    const [visible, setVisible] = useState(false);
    const dropdownRef = useRef(null);

    return (
        <View style={styles.container}>
            {isGroupAdmin && (
                <View>
                    {/* Three-dot menu button */}
                    <TouchableOpacity
                        onPress={() => setVisible(!visible)}
                        style={styles.iconButton}
                    >
                        <Ionicons name="ellipsis-vertical" size={24} color="black" />
                    </TouchableOpacity>

                    {/* Dropdown Menu */}
                    {visible && (
                        <View style={styles.dropdown} ref={dropdownRef}>
                            <TouchableOpacity 
                                style={styles.item} 
                                onPress={() => {
                                    handleOptionPress("Edit");
                                    setVisible(false);
                                }}
                            >
                                <Text>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.item} 
                                onPress={() => {
                                    handleOptionPress("Delete");
                                    setVisible(false);
                                }}
                            >
                                <Text>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.item} 
                                onPress={() => {
                                    handleOptionPress("Report");
                                    setVisible(false);
                                }}
                            >
                                <Text>Report</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        alignItems: "flex-end",
    },
    iconButton: {
        padding: 10,
    },
    dropdown: {
        position: "absolute",
        right: 10,
        top: 40,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    item: {
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
});

export default DropdownMenu;
