import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Inicio" }} />
      <Stack.Screen name="Search" options={{ title: "Buscar" }} />
      <Stack.Screen name="Config" options={{ title: "Configuración" }} />
      <Stack.Screen name="Welcome" options={{ title: "Explorar" }} />

    </Stack>
  );
}
