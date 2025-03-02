import * as Contacts from "expo-contacts";

export const fetchUserContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
        return fetchContacts();
    } else {
        console.warn("Contacts permission denied");
        return [];
    }
};

const fetchContacts = async () => {
    try {
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
        });

        return data || [];
    } catch (error) {
        console.error("Error fetching contacts: ", error);
        return []
    }
};