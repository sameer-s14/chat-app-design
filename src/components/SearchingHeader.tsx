import { Ionicons } from "@expo/vector-icons"
import { useRef, useState } from "react";
import { TouchableOpacity, Animated, View, StyleSheet, Text, TextInput } from "react-native";
import { COLORS } from "../constants";
import { hs, width } from "../utils";

function SearchingHeader({ searchTerm, setSearchTerm, backHandler, heading = 'Select contact' }) {
    const widthAnim = useRef(new Animated.Value(0)).current;
    const searchInputRef = useRef(null);
    const [isSearching, setIsSearching] = useState(false);

    const toggleSearch = () => {
        Animated.timing(widthAnim, {
            toValue: isSearching ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            if (!isSearching) {
                searchInputRef.current?.focus(); 
            }
        });;

        if (isSearching) {
            searchInputRef.current?.blur();
        }

        setIsSearching(!isSearching);
        if (!isSearching) setSearchTerm("");
    };

    return <View style={[styles.header, { borderBottomWidth: isSearching ? 0 : 1 }]}>
        {/* Title fades out when search is active */}
        <Animated.View style={[styles.titleContainer, { opacity: widthAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}>
            <TouchableOpacity onPress={backHandler}>
                <Ionicons name="arrow-back" size={25} color={COLORS.BLACK} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{heading}</Text>

            {/* Search Icon */}
            <TouchableOpacity onPress={toggleSearch} style={styles.searchIcon}>
                <Ionicons name="search" size={20} />
            </TouchableOpacity>
        </Animated.View>

        {/* Animated Search Input */}
        <Animated.View style={[styles.inputContainer, {
            width: widthAnim.interpolate({ inputRange: [0, 1], outputRange: [0, width] }),
            opacity: widthAnim,
        }]}>
            <View style={styles.searchBar}>
                <TouchableOpacity onPress={() => {
                    toggleSearch()
                    setSearchTerm("")
                }} style={styles.backIcon}>
                    <Ionicons name="arrow-back" size={25} color={COLORS.BLACK} />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search contacts"
                    value={searchTerm}
                    ref={searchInputRef}
                    onChangeText={setSearchTerm}
                    autoFocus={isSearching}
                />
                {searchTerm && (
                    <TouchableOpacity onPress={() => setSearchTerm("")} style={styles.closeIcon}>
                        <Ionicons name="close" size={25} />
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    </View>
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 10,
        borderBottomColor: COLORS.LIGHT_GRAY,
        height: hs(60),
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
    },
    headerTitle: {
        marginHorizontal: 10,
        fontSize: 18,
    },
    searchIcon: {
        marginLeft: "auto",
    },
    inputContainer: {
        position: "absolute",
        right: 0,
        overflow: "hidden",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center", borderRadius: 25,
        backgroundColor: COLORS.PALE_GRAY,
        height: hs(50),
    },
    backIcon: { marginHorizontal: 10 },
    searchInput: {
        height: 40,
        backgroundColor: "transparent",
        borderRadius: 10,
        paddingHorizontal: 15,
        flex: 1,
    },
    closeIcon: { marginLeft: "auto", marginRight: 10 },
});

export default SearchingHeader;