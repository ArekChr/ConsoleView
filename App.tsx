import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Log = {
  time: Date;
  level: string;
  message: string;
};

const capturedLogs: Log[] = [];
const originalConsoleLog = console.log;

console.log = (...args) => {
  capturedLogs.push({time: new Date(), level: 'log', message: args.join(' ')});
  originalConsoleLog.apply(console, args);
};

const ConsoleView = () => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    setLogs(capturedLogs);
  }, []);

  const handleExecute = () => {
    // Sanitize the input to escape special characters
    const sanitizedInput = input.replace(
      /[\u2018\u2019\u201C\u201D\u201E\u2026]/g,
      match => {
        return {
          '\u2018': "'",
          '\u2019': "'",
          '\u201C': '"',
          '\u201D': '"',
          '\u201E': '"',
          '\u2026': '...',
        }[match];
      },
    );

    try {
      // eslint-disable-next-line no-eval
      const result = eval.call(this, sanitizedInput);

      setLogs([
        ...logs,
        {time: new Date(), level: 'info', message: `> ${input}`},
        {time: new Date(), level: 'result', message: result},
      ]);
    } catch (e) {
      // If there's an error, add it to the logs
      setLogs([
        ...logs,
        {time: new Date(), level: 'error', message: `> ${sanitizedInput}`},
        {time: new Date(), level: 'error', message: `Error: ${e.message}`},
      ]);
    }
    setInput(''); // Clear the input
  };

  return (
    <ScrollView style={styles.root}>
      {logs.map((log, index) => (
        <Text
          style={{
            fontFamily: 'monospace',
          }}
          key={index}>{`${log.time.toLocaleTimeString()} [${log.level}] - ${
          log.message
        }`}</Text>
      ))}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setInput}
          value={input}
          placeholder="Enter command"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button title="Execute" onPress={handleExecute} />
      </View>
    </ScrollView>
  );
};

export default function App() {
  console.log('RENDERING APP');

  return (
    <SafeAreaView>
      <ConsoleView />
      <Text>parseInt result: {parseInt('10')}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 12,
  },
  container: {
    flex: 1,
    paddingTop: 50,
  },
  logs: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    height: 40,
    paddingHorizontal: 10,
  },
});
