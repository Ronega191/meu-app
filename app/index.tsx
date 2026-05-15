import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

const tarefas = [
  { id: 1, titulo: "Comprar leite" },
  { id: 2, titulo: "Estudar React Native" },
  { id: 3, titulo: "Fazer exercícios" },
];

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas tarefas</Text>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Digite uma tarefa" />
        <Button
          title="Adicionar"
          onPress={() => Alert.alert("Adicionar tarefa", "Vamos implementar isso no próxima aula")}
        />
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>{item.titulo}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: "#f6f7fb",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#c9ccd6",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#777",
    borderRadius: 4,
    marginRight: 10,
  },
  itemText: {
    fontSize: 18,
  },
});
