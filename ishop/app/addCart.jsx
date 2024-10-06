import { View, Text, Alert, Button, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function AddCart() {
    const [pId, setpId] = useState('');
    const [cqty, setquantity] = useState('');
    const [pname, setpname] = useState('');
    const [price, setprice] = useState('');
    const router = useRouter();

    const handleCart = () => {
        if (!pId || !cqty || !pname || !price) {
            Alert.alert('Error', 'Please fill all the fields');
            return;
        }

        const cartItem = { pId, pname, cqty, price };

        axios
            .post("http://10.0.2.2:3000/addCart", cartItem)
            .then(response => {
                Alert.alert('Success', 'Product added to cart',[
                {
                    text: 'OK', 
                    onPress: () => router.push('/cart'),
                }
            ]);
                setpId('');
                setquantity('');
                setpname('');
                setprice('');
            })
            .catch(error => {
                Alert.alert('Error', 'Failed to add product to cart');
                console.error('Error adding to cart:', error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add to Cart</Text>
            <TextInput
                style={styles.input}
                placeholder="Product ID"
                value={pId}
                onChangeText={setpId}
            />
            <TextInput
                style={styles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                value={cqty}
                onChangeText={setquantity}
            />
            <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={pname}
                onChangeText={setpname}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={price}
                onChangeText={setprice}
            />
            <Button
                title="Add to Cart"
                onPress={handleCart}
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
