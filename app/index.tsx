import React, { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";

// Definir el tipo de datos que vienen de la API
interface Evento {
  _id: string;
  Tipo: string;
  Evento: string;
  Fecha: string;
  Inicio: string;
  Fin: string;
  Sala: string;
  Edificio: string;
  Campus: string;
  fechaActualizacion: string;
}

export default function Index() {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    fetch("https://7uk8il9o.vercel.app/eventos") // URL de la API en Vercel
      .then(response => response.json())
      .then((data: Evento[]) => setEventos(data))
      .catch(error => console.error("Error al obtener eventos:", error));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text>
            {item.Fecha} - {item.Evento} en {item.Sala}, {item.Campus}
          </Text>
        )}
      />
    </View>
  );
}
