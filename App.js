import React from 'react';
import { StyleSheet, Text, View, Platform, ListView, Keyboard } from 'react-native';

import Header from './Header';
import Footer from './Footer';
import Row from './Row';

const filterItems = (items, filter) => items.filter((item) => {
  if (filter === 'all') return true;
  if (filter === 'active') return !item.complete;
  if (filter === 'completed') return item.complete;
  throw new Error(`Unknow filter: ${filter}`);
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      allComplete: false,
      filter: 'all',
      value: '',
      items: [],
      dataSource: ds.cloneWithRows([]),
    };
    this.setSource = this.setSource.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
  }

  setSource(items, dataSourceItems, otherState = {}) {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(dataSourceItems),
      ...otherState,
    });
  }

  handleFilter(filter) {
    this.setSource(this.state.items, filterItems(this.state.items, filter), { filter });
  }

  handleRemoveItem(key) {
    const newItems = this.state.items.filter((item) => item.key !== key);

    this.setSource(newItems, filterItems(newItems, this.state.filter));
  }

  handleToggleComplete(key, complete) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;

      return {
        ...item,
        complete,
      };
    });
    const allComplete = newItems.every((item) => item.complete);

    this.setSource(newItems, filterItems(newItems, this.state.filter), { allComplete });
  }

  handleToggleAllComplete() {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => ({
      ...item,
      complete,
    }));

    this.setSource(newItems, filterItems(newItems, this.state.filter), { allComplete: complete });
  }

  handleAddItem() {
    if (!this.state.value) {
      return;
    }

    const newItems = [
      ...this.state.items,
      {
        key: Date.now(),
        text: this.state.value,
        complete: false,
      },
    ];

    this.setSource(newItems, filterItems(newItems, this.state.filter), { value: '' });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onToggleAllComplete={this.handleToggleAllComplete}
          onAddItem={this.handleAddItem}
          onChange={(value) => this.setState({ value })}
        />
        <View style={styles.content}>
          <ListView
            style={styles.list}
            enableEmptySections
            dataSource={this.state.dataSource}
            onScroll={() => Keyboard.dismiss()}
            renderRow={({key, ...value}) => {
              return (
                <Row
                  key={key}
                  onRemove={() => this.handleRemoveItem(key)}
                  onComplete={(complete) => this.handleToggleComplete(key, complete)}
                  {...value}
                />
              );
            }}
            renderSeparator={(sectionId, rowId) => {
              return (
                <View key={rowId} style={styles.separator} />
              );
            }}
          />
        </View>
        <Footer
          filter={this.state.filter}
          onFilter={this.handleFilter}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'stretch',
    justifyContent: 'center',
    ...Platform.select({
      android: {
        paddingTop: 30
      },
    }),
  },
  content: {
    flex: 1,
  },
  list: {
    backgroundColor: '#FFF',
  },
  separator: {
    borderWidth: 1,
    borderColor: '#eee',
  },
});
