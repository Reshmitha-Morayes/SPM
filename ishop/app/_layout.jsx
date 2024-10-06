import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{title:"iShop Application"}}/>
      <Stack.Screen name="inventory" options={{title:"Inventory"}}/>
      <Stack.Screen name="addInventory" options={{title:"Add Inventory"}}/>
      <Stack.Screen name="updateInventory" options={{title:"Update Inventory"}}/>
      <Stack.Screen name="cart" options={{title:"Cart"}}/>
      <Stack.Screen name="addCart" options={{title:"Add Cart"}}/>
    </Stack>
  );
}
