import BackButton from '@/components/BackButton'
import ModalWrapper from '@/components/ModalWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { ScrollView, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getAccountImage } from '@/services/imageServices'
import * as Icons from 'phosphor-react-native'
import Typo from '@/components/Typo'
import InputSmaller from '@/components/InputSmaller'
import { UserDataType } from '@/types'
import Button from '@/components/Button'
import Header from '@/components/Header'



const AccountModal = () => {

    {/* UPDATE ONCE FIREBASE IS DONE (everything after 34:11 on video 6*/}

    const [userData, setUserData] = useState<UserDataType>({
        name: "",
        image: null
    })

    const[loading, setLoading] = useState(false)

    const onSubmit = async() => {
        let{name, image} = userData;
        if(!name.trim()){
            Alert.alert('User', 'Please fill all the fields')
            return
        }
    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header
                    title='Update Profile' 
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }}
                />

                {/* form */}
                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.avatarContainer}>
                        {/* source of image should be changed to userData.image */}
                        <Image
                            style={styles.avatar}
                            source={getAccountImage(null)}
                            contentFit='cover'
                            transition={100}
                        />

                        <TouchableOpacity style={styles.editIcon}>
                            <Icons.Pencil
                                size={verticalScale(20)}
                                color={colors.neutral800}
                            />
                        </TouchableOpacity>
                    </View>


                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Name</Typo>
                        <InputSmaller
                            placeholder='Name'
                            value={userData.name}
                            onChangeText={(value) => setUserData({...userData, name: value})} 
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Username</Typo>
                        <InputSmaller
                            placeholder='Username'
                            value={userData.name}
                            onChangeText={(value) => setUserData({...userData, name: value})} 
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Email</Typo>
                        <InputSmaller
                            placeholder='Email'
                            value={userData.name}
                            onChangeText={(value) => setUserData({...userData, name: value})} 
                        />
                    </View>

                </ScrollView>
                <View style={styles.footer}>
                    <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                        <Typo color={colors.black} fontWeight={'700'}>
                            Update
                        </Typo>
                    </Button>
                </View>
            </View>
        </ModalWrapper>
    )
}

export default AccountModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingY._10,
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1,
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,
    },
    avatarContainer: {
        position: 'relative',
        alignSelf: 'center',
    },
    avatar: {
        alignSelf:'center',
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500,
    },
    editIcon: {
        position: 'absolute',
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7,
    },
    inputContainer: {
        gap: spacingY._5,
    }
})
