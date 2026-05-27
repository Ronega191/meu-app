import * as sqlite from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";
import { Button, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const db = sqlite.openDatabaseSync("tarefas.db");

export default function Index() {
  const [tarefas, setTarefas] = useState<{ id: number; titulo: string; concluido: boolean }[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [filtrocl, setFiltrocl] = useState<"concluidas" | "pendentes" | "todas">("todas");

  useEffect(() => {
    db.execAsync(`CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      titulo TEXT, 
      concluido INTEGER not null default 0
      )`
    );
    carregarTarefas();
  }, []);

  function carregarTarefas() {
    const resultado = db.getAllSync<{ id: number; titulo: string; concluido: number }>("SELECT * FROM tarefas");
    setTarefas(
      resultado.map((tarefas) => ({
        id: tarefas.id,
        titulo: tarefas.titulo,
        concluido: tarefas.concluido === 1,
      }))
    )
  }

  useEffect(() => {
    db.runSync("insert into tarefas (titulo, concluido) values (?, ?)", [novaTarefa, 0]);
  }, [tarefas]);

 const listafiltro = useMemo(() => {
    if (filtrocl === "concluidas") {
      return tarefas.filter((t) => t.concluido);
    }
    if (filtrocl === "pendentes") {
      return tarefas.filter((t) => !t.concluido);
    }
    return tarefas;
  }, [filtrocl, tarefas]);


  function adicionarTarefa() {
    db.runSync("insert into tarefas (titulo, concluido) values (?, ?)", [novaTarefa, 0]);
    setNovaTarefa("");
  }

  function toggleTarefa(id: number) {
    const tarefa = tarefas.find((titem) => titem.id === id);
    db.runSync(
      "update tarefas set concluido = ? where id = ?", [tarefa?.concluido ? 0 : 1, id]);
    carregarTarefas();
  }

  function excluirTarefa(id: number) {
    const tarefa = tarefas.find((titem) => titem.id === id);
    db.runSync(
      "delete from tarefas set concluido =? where id = ?", [tarefa?.concluido ? 0 : 1, id]);
    carregarTarefas();
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas tarefas</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa"
          value={novaTarefa}
          onChangeText={setNovaTarefa}
        />
        <Button title="Adicionar" onPress={adicionarTarefa} />
      </View>
      
      <View style={styles.inputRow}>
        <Button title="todas" onPress={() => setFiltrocl("todas") } />
        <Button title="concluídas" onPress={() => setFiltrocl("concluidas")} />
        <Button title="pendentes" onPress={() => setFiltrocl("pendentes")} />
      </View>

      <FlatList
        data={listafiltro}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <view>
          <Pressable style={styles.itemRow} onPress={() => toggleTarefa(item.id)}>
            <View style={[styles.checkbox, item.concluido && styles.checkboxConcluido]} />
            <Text style={[styles.itemText, item.concluido && styles.itemTextConcluido]}>{item.titulo}</Text>
          </Pressable>
          <Button title="Excluir" onPress={() => {excluirTarefa(item.id);}} />
          </view>
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
  checkboxConcluido: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  itemTextConcluido: {
    textDecorationLine: "line-through",
    color: "#777",
  },
});
