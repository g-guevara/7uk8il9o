import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Search" options={{ title: "Buscar" }} />
      <Stack.Screen name="Config" options={{ title: "Configuración" }} />
      <Stack.Screen name="User" options={{ title: "Explore" }} />
      {/* Aquí debería ir Profile */}
    </Stack>
  );
}
