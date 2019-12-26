import React, {useState, useEffect, } from 'react'
import { Platform, StyleSheet, Text, SafeAreaView, Image, TouchableOpacity, View, AsyncStorage } from 'react-native'
import io from 'socket.io-client'

import api from '../services/api';
import logo from '../../assets/logo.png'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import itsamatch from '../../assets/itsamatch.png'


export default function Main({navigation}){
    const id = navigation.getParam('user')
    const [users, setUsers] = useState([])
    const [matchDev, setMatchDev] = useState(null)
    

    async function handleLogout(){
        
        await AsyncStorage.clear()
        navigation.navigate('Login')


    }

    useEffect(() => {
        async function loadusers(){
            const response = await api.get('/devs',{
                headers: {
                    user: id,
                }
            })
            setUsers(response.data)

        }
        loadusers()
    }, [id])

    useEffect(() => {
        const socket = io('http://192.168.31.12:3333', {
            query: { user: id}
        })

        socket.on('match', dev =>{
            setMatchDev(dev)
        })

    }, [id])

    async function handleLike(){
        const [ user, ...rest] = users

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: {user: id}
        })

        setUsers(rest)
        
    }
    async function handleDislike(){
        const [user, ...rest] = users

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: {user: id}
        })

        setUsers(rest)
        
    }

    return( 
    <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo}/>
        </TouchableOpacity>
        
        <View style={styles.cardsContainer}>
            {users.length === 0 
                ? <Text style={styles.empty}>Acabou! :(</Text>
                :(
                
                users.map((user, index )=> (
                    <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                        <Image style={styles.avatar} source={{ uri: user.avatar }} />

                        <View style={styles.footer}>
                            <Text style={styles.name}>{user.name}</Text>
                            <Text numberOfLines={3} style={styles.bio}>{user.bio}</Text>
                        </View>
                    </View>
                )) 
                )}
        </View>
        { users.length > 0 && (
        <View style={styles.btnsContainer}>
            <TouchableOpacity onPress={handleDislike} style={styles.btn}>
                <Image source={dislike}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLike} style={styles.btn}>
                <Image source={like} ></Image>
            </TouchableOpacity>

        </View>
        )}
        {matchDev && (
            <View style={styles.matchContainer}>
                <Image style={styles.matchImage} source={itsamatch}/>
                <Image style={styles.matchAvatar} source={{uri: matchDev.avatar}}/>
                <Text style={styles.matchName}>{matchDev.name}</Text>
                <Text style={styles.matchBio}>{matchDev.bio}</Text>
                <TouchableOpacity onPress={() => setMatchDev(null)}>
                    <Text style={styles.closeMatch}>fechar</Text>
                </TouchableOpacity>
            </View>
        )}
    </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        // marginTop: Platform.OS === 'android' ? 24 : 0,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        marginTop: 30,
        width: 97,
        height: 34,
    },
    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
    },
    cardsContainer:{
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 600,
        
    },
    card:{
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 10,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,

    },
    avatar: {
        flex: 1,
        height: 3500,
        backgroundColor: '#DDD'
    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical:15,

    },
    name:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'


    },
    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18,

    },
    btnsContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    btn: {
        width: 60,
        height:60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        }
    },
    matchContainer: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    matchImage: {
        height: 60,
        resizeMode: 'contain',
    },
    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30,
    },
    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff'

    },
    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30
    },
    closeMatch:  {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold',
    },

})