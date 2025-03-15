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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 20,
    marginBottom: 16,
  },
  darkTitle: {
    color: "#ecf0f1",
  },
  darkText: {
    color: "#ecf0f1",
  },
  darkSubText: {
    color: "#95a5a6",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  darkSearchInput: {
    backgroundColor: "#2c3e50",
    borderColor: "#34495e",
    color: "#ecf0f1",
  },
  searchButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
  resultsCount: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 12,
  },
  eventList: {
    flex: 1,
  },
  eventItem: {
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  darkEventItem: {
    backgroundColor: "#2c3e50",
    borderColor: "#34495e",
  },
  selectedEventItem: {
    backgroundColor: "#e8f4fd",
    borderColor: "#3498db",
  },
  darkSelectedEventItem: {
    backgroundColor: "#2980b9",
    borderColor: "#3498db",
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  eventType: {
    fontSize: 14,
    color: "#3498db",
    marginBottom: 4,
    fontStyle: "italic",
  },
  eventDetails: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: "#95a5a6",
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  darkFooterButton: {
    backgroundColor: "#2c3e50",
    borderColor: "#34495e",
  },
  footerButtonText: {
    color: "#2c3e50",
    fontWeight: "bold",
  },
  darkFooterButtonText: {
    color: "#ecf0f1",
  },
});