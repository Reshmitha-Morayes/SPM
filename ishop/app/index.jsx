import { Button, View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter()
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Button
        title="Go to Inventory"
        onPress={() => router.push('/inventory')}
      />

      <Button
        title="Go to Cart"
        onPress={() => router.push('/cart')}
      />
    </View>
  );
}
