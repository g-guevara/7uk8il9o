import { StyleSheet, StatusBar, Platform } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    // Añadir padding para StatusBar cuando es translúcido
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  darkContainer: {
    backgroundColor: "#1a1a1a",
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
    textAlign: "center",
  },
  darkTitle: {
    color: "#ecf0f1",
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
  darkSubTitle: {
    color: "#95a5a6",
  },
  darkText: {
    color: "#ecf0f1",
  },
  darkSubText: {
    color: "#95a5a6",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    minWidth: 150,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkStatCard: {
    backgroundColor: "#2c3e50",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 32,
  },
  mainButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkMainButton: {
    backgroundColor: "#2980b9",
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
  },
  leftSideContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  userIconButton: {
    padding: 5,
  },
  // dateContainer: {j
  //   marginTop: 10,
  //   alignItems: "center",
  //   flexDirection: "row",
  // },
  // dateDay: {
  //   fontSize: 50,
  //   color: "#2c3e50",
  //   lineHeight: 70, // Asegura suficiente espacio vertical
  //   marginRight: 15, 
  //   fontWeight: "300",
    
  // },
  // dateMonth: {
  //   fontSize: 50,
  //   color: "#2c3e50",
  //   lineHeight: 70, // Asegura suficiente espacio vertical
  //   fontWeight: "300"
  // },
  dateTextContainer: {
    alignItems: "center", // Asegura que el texto esté centrado en columna
  },




  dateContainer: {
    alignItems: "flex-start", // Alinea todo a la izquierda
    justifyContent: "center",
    marginLeft: 10, // Margen para que no quede pegado al borde
  },
  
  dateWeekday: {
    fontSize: 18, // Reduce un poco el tamaño del texto
    color: "#2c3e50",
    marginBottom: 2, // Reduce el espacio entre el día de la semana y el número
    textAlign: "left",
    fontWeight: "400",
  },
  
  dateRow: {
    flexDirection: "row", // Alinea el número del día y el mes en la misma línea
    alignItems: "center", // Asegura que estén alineados correctamente
    gap: 10, // Reduce el espacio entre el número y el mes
  },
  
  dateDay: {
    fontSize: 45, // Reduce un poco el tamaño del número
    color: "#2c3e50",
    lineHeight: 50, // Reduce el espacio vertical
    fontWeight: "300",
    transform: [{ scaleY: 0.95 }], // Ajusta la altura ligeramente
  },
  
  dateMonth: {
    fontSize: 45, // Reduce el tamaño del mes
    color: "#2c3e50",
    lineHeight: 50, // Reduce el espacio vertical
    fontWeight: "300",
    transform: [{ scaleY: 0.95 }], // Ajusta la altura ligeramente
  },
  
  
  searchIconButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 5,
  },
  footerText: {
    fontSize: 14,
    color: "#7f8c8d",
  },

  // Add these styles to your existing styles object in Index.styles.js

// Event list styles
// eventListContainer: {
//   width: '100%',
//   marginVertical: 20,
// },
// eventCard: {
//   width: '100%',
//   borderRadius: 16,
//   padding: 15,
//   marginBottom: 12,
//   flexDirection: 'column',
// },
eventTimeContainer: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  marginBottom: 4,
},
eventTimeText: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#000000',
  marginRight: 10,
},
eventTitleText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#000000',
  marginVertical: 4,
},
eventParticipantsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 8,
},
eventParticipantText: {
  fontSize: 12,
  color: '#000000',
  marginRight: 16,
  opacity: 0.8,
},

// // Main content container for proper spacing
// mainContentContainer: {
//   flex: 1,
//   width: '100%',
// },

// eventListContentContainer: {
//   marginTop: 100,

  
// },


// Modifica estos estilos en el archivo Index.styles.js

// Modifica el estilo del contenedor principal para asegurar que ocupe todo el espacio
mainContentContainer: {
  flex: 1,
  width: '100%',
},

// Reduce el marginTop para que la lista comience más arriba
eventListContentContainer: {
  marginTop: 20, // Reduce de 100 a 20
  paddingBottom: 20, // Añade padding en la parte inferior
},

// Asegura que el contenedor de la lista tenga flex:1 para ocupar todo el espacio disponible
eventListContainer: {
  flex: 1,
  width: '100%',
  marginVertical: 10, // Reduce de 20 a 10
},

// Asegúrate de que las tarjetas de eventos tengan suficiente margen inferior
eventCard: {
  width: '100%',
  borderRadius: 16,
  padding: 15,
  marginBottom: 15, // Aumenta ligeramente el espacio entre tarjetas
  flexDirection: 'column',
}
});