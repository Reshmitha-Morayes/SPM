import { Text, View, Button, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Inventory() {
  const router = useRouter();
  const [items, setitems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:3000/inventorydetails');
        setitems(response.data);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (item) => {
    Alert.alert(
      "Delete Product from Inventory",
      "Are you sure you want to delete this item from the inventory?",
      [
        { text: "Cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              const deleteUrl = `http://10.0.2.2:3000/deleteInventory/${item._id}`;
              await axios.delete(deleteUrl);
              setitems(prevItems => prevItems.filter(invItem => invItem._id !== item._id));
              Alert.alert("Success", "Item deleted successfully");
            } catch (error) {
              console.log('Error deleting item', error);
              Alert.alert('Error', 'Failed to delete the item');
            }
          },
        },
      ]
    );
  };

  const handleAddToCart = (item) => {
    axios.post('http://10.0.2.2:3000/addCart', { pId: item.productId, pname: item.name, cqty: 1, price: item.price })
      .then(response => {
        Alert.alert('Success', 'Item added to cart');
        console.log(response.data);
      })
      .catch(error => {
        console.log('Error adding item to cart', error);
        Alert.alert('Error', 'Could not add item to cart');
      });
  };

  const generateReport = () => {
    let report = "Inventory Report:\n\n";
    let totalInventoryValue = 0;

    items.forEach(item => {
      const totalPrice = item.price * item.quantity;
      report += `Name: ${item.name}\nQuantity: ${item.quantity}\nPrice per Unit: Rs.${item.price}\nTotal Price: Rs.${totalPrice}\n\n`;
      totalInventoryValue += totalPrice;
    });

    report += `Total Inventory Value: Rs.${totalInventoryValue}\n`;

    Alert.alert("Inventory Report", report);
    console.log(report);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Price: Rs.{item.price}/=</Text>
      <Text style={styles.price}>Quantity: {item.quantity}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>

      <Button
        title="Update Stocks"
        onPress={() => router.push(`/updateInventory?id=${item.productId}`)}
      />

      <Button
        title="Click to add cart automatically"
        onPress={() => handleAddToCart(item)}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Button
        title="Add Stocks"
        onPress={() => router.push('/addInventory')}
      />

      <Button
        title="Generate Report"
        onPress={generateReport}
      />

      <Text style={styles.header}>Inventory</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        renderItem={renderItem}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  deleteButton: {
    backgroundColor: '#ff6666',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
