import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function AddInventory() {
    const [productId, setpId] = useState('');
    const [name, setpname] = useState('');
    const [category, setcategory] = useState('');
    const [quantity, setquantity] = useState('');
    const [price, setprice] = useState('');
    const [imageUrl, seturl] = useState('');
    const [description, setdescription] = useState('');
    const router = useRouter();

    const handleSubmit = () => {
        
        if (!productId || !name || !category || !quantity || !price || !imageUrl || !description) {
            Alert.alert('Error', "Please fill all the fields");
            return;
        }

        
        const quantityNum = Number(quantity);
        const priceNum = Number(price);

        if (isNaN(quantityNum) || quantityNum <= 0) {
            Alert.alert('Error', "Quantity must be a positive number");
            return;
        }

        if (isNaN(priceNum) || priceNum <= 0) {
            Alert.alert('Error', "Price must be a positive number");
            return;
        }

        
        if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(imageUrl)) {
            Alert.alert('Error', "Please enter a valid image URL");
            return;
        }

        const products = {
            productId, name, category, quantity: quantityNum, price: priceNum, imageUrl, description,
        };

        axios
            .post("http://10.0.2.2:3000/CreateInventory", products)
            .then(response => {
              Alert.alert('Success', "Stocks added to inventory", [
                {
                    text: 'OK', 
                    onPress: () => router.push('/inventory'),
                }
            ]);
          })
            .catch(error => {
                Alert.alert('Error', 'Failed to add product to inventory');
                console.error('Error adding to inventory', error);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add Inventory</Text>
            <TextInput
                style={styles.input}
                placeholder="Product ID"
                value={productId}
                onChangeText={setpId}
            />
            <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={name}
                onChangeText={setpname}
            />
            <TextInput
                style={styles.input}
                placeholder="Category"
                value={category}
                onChangeText={setcategory}
            />
            <TextInput
                style={styles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setquantity}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                keyboardType="numeric"
                value={price}
                onChangeText={setprice}
            />
            <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={imageUrl}
                onChangeText={seturl}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setdescription}
            />
            <Button
                title="Add Product"
                onPress={handleSubmit}
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
