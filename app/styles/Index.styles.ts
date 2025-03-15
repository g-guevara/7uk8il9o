import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  darkContainer: {
    backgroundColor: "#1a1a1a",
  },
  header: {
    marginTop: 40,
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
  userIconButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 5,
  },
  
  footerText: {
    fontSize: 14,
    color: "#7f8c8d",
  },
});