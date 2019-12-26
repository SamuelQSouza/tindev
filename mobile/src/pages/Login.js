import React, {useState, useEffect, } from 'react'

import { KeyboardAvoidingView, StyleSheet, TextInput, Text, Image, TouchableOpacity, AsyncStorage } from 'react-native'

import api from '../services/api';

import logo from '../../assets/logo.png'

export default function Login( {navigation}) {
    const[user, setUser] = useState('')

    useEffect(() => {
        AsyncStorage.getItem('user').then(user =>{
            if(user){
                navigation.navigate('Main', {user})
                
            }
        })

    }, [])

    async function handleLogin(){
        const response = await api.post('/devs', { username: user } )
        
        
        const {_id} = response.data
        console.log({_id});
        await AsyncStorage.setItem('user', JSON.stringify(_id))

        navigation.navigate('Main', {user: _id})


    }

    return (
    <KeyboardAvoidingView 
    behavior= 'padding'
    //    enabled={Platform.OS === 'ios'}
    style={styles.container}>
        <Image source={logo} style={styles.img}/>
        <TextInput
        autoCapitalize='none'
        autoCorrect={false}
        placeholder='digite seu usuario do github'
        placeholderTextColor= '#999'
        style={styles.input}
        value={user}
        onChangeText={setUser}
        />
            <TouchableOpacity onPress={handleLogin} style={styles.btn}>
            <Text style={styles.btnText}>
                    Enviar
            </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        


    },
    img: {//delete this style
        
        width: 97,
        height: 34,
    },
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginTop: 20,
        paddingHorizontal: 15,        
    },
    btn: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 5,
        marginTop: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',        
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
    }
})
