import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FlatList, Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { FIRESTORE_DB } from './firebaseConfig';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');

  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'tasks'));
      const tasksArray = [];
      querySnapshot.forEach((doc) => {
        tasksArray.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setTasks(tasksArray);
    } catch (error) {
      console.error('Error fetching tasks: ', error.message);

      setTimeout(fetchTasks, 5000);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (taskTitle.trim()) {
      try {
        const docRef = await addDoc(collection(FIRESTORE_DB, 'tasks'), {
          title: taskTitle,
          status: false
        });
        console.log('Document written with ID: ', docRef.id);
        setTaskTitle('');
        fetchTasks();
      } catch (error) {
        console.error('Error adding task: ', error.message);
      }
    }
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    try {
      const taskRef = doc(FIRESTORE_DB, 'tasks', id);
      await updateDoc(taskRef, {
        status: !currentStatus
      });
      console.log('Document updated with ID: ', id);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status: ', error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const taskRef = doc(FIRESTORE_DB, 'tasks', id);
      await deleteDoc(taskRef);
      console.log('Document deleted with ID: ', id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task: ', error.message);
    }
  };

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        Platform.OS === 'ios' && { paddingHorizontal: 20 }
      ]}
    >
      <View style={styles.headingContainer}>
        <Text style={styles.mainHeading}>Todo App</Text>
        <Text style={styles.subHeading}>1181650</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addTask}
          disabled={!taskTitle.trim()}
        >
          <Text style={styles.addButtonText}>ADD TASK</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={item.status ? styles.taskDone : styles.taskDue}>{item.title}</Text>
            <TouchableOpacity onPress={() => toggleTaskStatus(item.id, item.status)}>
              <Text style={styles.statusButton}>{item.status ? 'Done' : 'Due'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, 
    backgroundColor: '#f8f8f8'
  },
  headingContainer: {
    marginBottom: 20
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  subHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 20
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  taskDue: {
    textDecorationLine: 'none',
    color: 'black'
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: 'gray'
  },
  statusButton: {
    color: 'blue',
    marginRight: 10
  },
  deleteButton: {
    color: 'red'
  }
});

export default App;
