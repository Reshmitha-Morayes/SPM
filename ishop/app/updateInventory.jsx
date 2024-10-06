import { View, Text, StyleSheet, Button, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useGlobalSearchParams } from 'expo-router';

export default function updateInventory() {
    const {id} = useGlobalSearchParams();
    const [productId, setpId] = useState('');
    const [name, setpname] = useState('');
    const [category, setcategory] = useState('');
    const [quantity, setqty] = useState('');
    const [price, setprice] = useState('');
    const [imageUrl, seturl] = useState('');
    const [description, setdescription] = useState('');

    useEffect(() => {
      axios.get('http://10.0.2.2:3000/getInventory/' + id)
        .then(result => {
          console.log(result)
          setpId(result.data.productId)
          setpname(result.data.name)
          setcategory(result.data.category)
          setqty(result.data.quantity)
          setprice(result.data.price)
          seturl(result.data.imageUrl)
          setdescription(result.data.description)
        })
          
        .catch(err => console.log(err))
    },[id])

    const update = (item) => {
      e.preventDefault();
      axios.put(`http://10.0.2.2:3000/updateInventory/${item._id}`, {productId, name, category, quantity, price, imageUrl, description})
      .then(result => {console.log(result);})
      .catch(err => console.log(err))
    }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Inventory</Text>
      <TextInput
        style={styles.input}
        placeholder="Product ID"
        value={productId}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={(e) => setpname(e.target.value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={(e) => setqty(e.target.value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={(e) => setprice(e.target.value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
      />
      <Button
        title="Update Product"
        onPress={update}
      />
    </View>
  
);
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});
