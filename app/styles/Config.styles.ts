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
    marginBottom: 24,
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
  themeSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 12,
  },
  themeToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  themeLabel: {
    fontSize: 16,
    color: "#2c3e50",
  },
  eventsSection: {
    flex: 1,
  },
  eventsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  searchMoreButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  searchMoreButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  eventsList: {
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
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 6,
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
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 16,
    textAlign: "center",
  },
  addFirstButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: "#fff",
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
