import { Text, View } from "react-native"
import { CountryButton } from "react-native-country-codes-picker"

function CountryCodeHeader({ countries, lang, onPress }) {
    return (
        <View
            style={{
                paddingBottom: 20,
            }}
        >
            <Text>
                Popular countries
            </Text>
            {countries?.map((country, index) => {
                return (
                    <CountryButton key={index} item={country} name={country?.name?.[lang || 'en']} onPress={() => onPress(country)} />
                )
            })}
        </View>
    )
}

export default CountryCodeHeader;