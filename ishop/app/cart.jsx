import { Text, View, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Cart() {
    const router = useRouter();
    const [carts, setCarts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://10.0.2.2:3000/cartdetails');
                setCarts(response.data);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    const handleDelete = (item) => {
        Alert.alert(
            "Delete Product From Cart",
            "Are you sure you want to delete this item from the cart?",
            [
                { text: 'Cancel' },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            const deleteUrl = `http://10.0.2.2:3000/deleteCart/${item._id}`; // Use item._id directly
                            console.log('Delete URL:', deleteUrl);

                            const response = await axios.delete(deleteUrl);
                            console.log('Delete response:', response.data);

                            setCarts(prevCarts => prevCarts.filter(cartItem => cartItem._id !== item._id)); // Use item._id directly
                            Alert.alert("Item deleted successfully");
                        } catch (error) {
                            console.error('Error deleting item:', error);
                            Alert.alert('Error', 'Failed to delete the item');
                        }
                    }
                }
            ]
        );
    };

    const handleQuantityChange = async (item, action) => {
        let updatedQty = item.cqty;
        if (action === 'increase') {
            updatedQty += 1;
        } else if (action === 'decrease' && item.cqty > 1) {
            updatedQty -= 1;
        }

        try {
            await axios.put(`http://10.0.2.2:3000/updateCart/${item._id}`, { cqty: updatedQty }); // Adjusted to use _id
            setCarts(prevCarts =>
                prevCarts.map(cartItem =>
                    cartItem._id === item._id ? { ...cartItem, cqty: updatedQty } : cartItem
                )
            );
        } catch (error) {
            console.log('Error updating quantity', error);
            Alert.alert('Error', 'Failed to update quantity');
        }
    };

    const renderItem = ({ item }) => {
        item.total = item.cqty * item.price;

        return (
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <Text style={styles.name}>{item.pname}</Text>
                    <Text style={styles.price}>Price per Item: Rs.{item.price}/=</Text>
                    <View style={styles.quantityContainer}>

                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleQuantityChange(item, 'decrease')}
                        >
                            <Text style={styles.quantityText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.quantityText}>{item.cqty}</Text>

                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleQuantityChange(item, 'increase')}
                        >
                            <Text style={styles.quantityText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.price}>Total Price: Rs.{item.total}/=</Text>
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item)}
                >
                    <Text style={styles.deleteText}>X</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const calculateTotal = () => {
        return carts.reduce((acc, item) => acc + (item.cqty * item.price), 0);
    };

    return (
        <View style={styles.container}>
            <Button
                title="Add to Cart"
                onPress={() => router.push('/addCart')}
            />
            <Text style={styles.header}>Cart Items</Text>
            <FlatList
                data={carts}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total Amount: Rs.{calculateTotal()}/=</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    price: {
        fontSize: 16,
        color: '#888',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    quantityButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    quantityText: {
        fontSize: 18,
        color: '#000',
    },
    deleteButton: {
        backgroundColor: '#ff6666',
        padding: 10,
        borderRadius: 5,
    },
    deleteText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    totalContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
