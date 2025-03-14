import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ChatScreen from "@/src/screens/ChatScreen";
import StatusScreen from "@/src/screens/StatusScreen";
import CallsScreen from "@/src/screens/CallsScreen";
import { COLORS } from "@/src/constants";

export const HomeTabsNavigation = () => {
    const Tab = createBottomTabNavigator();
    return <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === "Chats") {
                    iconName = focused ? "chatbubbles" : "chatbubbles-outline";
                } else if (route.name === "Status") {
                    iconName = focused ? "reload-circle" : "reload-circle-outline";
                } else if (route.name === "Calls") {
                    iconName = focused ? "call" : "call-outline";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: COLORS.PRIMARY,
            tabBarInactiveTintColor: COLORS.TEXT_DARK,
            tabBarStyle: {
                paddingBottom: 5,
                height: 60,
                borderTopWidth: 0,
                elevation: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                marginBottom: 5,
                fontWeight: "500",
            },
            headerShown: false,
        })}
    >
        <Tab.Screen name="Chats" component={ChatScreen} />
        <Tab.Screen name="Status" component={StatusScreen} />
        <Tab.Screen name="Calls" component={CallsScreen} />
    </Tab.Navigator>
}