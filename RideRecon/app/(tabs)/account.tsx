import Header from '@/components/Header'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import React from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image'
import { getAccountImage } from '@/services/imageServices'
import { accountOptionType } from '@/types'
import * as Icons from 'phosphor-react-native'
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper'


const Account = () => {
    const router = useRouter();

    const accountOptions: accountOptionType[] = [
        {
            title: 'Sign Out',
            icon: <Icons.SignOut size={26} color={colors.white} />,
        },
        {
            title: 'Edit Account',
            icon: <Icons.User size={26} color={colors.white} />,
            routeName: '(modals)/accountModal',
        },
        {
            title: 'Identification History',
            icon: <Icons.ClockCounterClockwise size={26} color={colors.white}/>,
            routeName: '(modals)/historyModal',
            params: { mode: 'view' },
        }
    ]

    {/* FIX: Video #6 @ 19:17 */}
    const showLogoutAlert = ()=>{
        Alert.alert("Confirm", "Are you sure you want to sign out?",[
            {
                text: "Cancel",
                onPress: ()=> console.log('cancel sign out'),
                style: 'cancel'
            },
            {
                text: "Logout",
                onPress: ()=> console.log('sign out needs to be fixed'),
                style: 'cancel'
            }
        ])
    }

    const handlePress = async (item: accountOptionType) => {
        if (item.title == 'Sign Out'){
            showLogoutAlert();
        }

        if(item.routeName) {
            router.push({
                pathname: item.routeName,
                params: item.params || {}, 
            });
        };
    }

    return (
    <ScreenWrapper>
        <View style={styles.container}>
            <Header title='Account Details' style={{marginVertical: spacingY._30}}/>

            {/* user info */}
            <View style={styles.userInfo}>

                {/* avatar */}
                <View>
                    {/* insert user_image */}
                    {/* must be fixed */}
                    <Image
                        source={getAccountImage(null)}
                        style={styles.avatar}
                        contentFit ='cover'
                        transition={100}

                    />
                </View>


                {/* user info */}
                <View style={styles.nameContainer}>
                    {/* insert name (6:58)*/}
                    <Typo size={24} fontWeight={'600'} color={colors.neutral100}>
                        insert_name
                    </Typo>
                    {/* insert email (6:58)*/}
                    <Typo size={15} color={colors.neutral400}>
                        insert_email
                    </Typo>
                </View>  
            </View>

            {/* account options */}
            <View style={styles.accountOptions}>
                {
                    accountOptions.map((item)=>{
                        return(
                            <View style={styles.listItem}>
                                <TouchableOpacity style={styles.flexRow} onPress={() => handlePress(item)}>
                                    {/* icon */}
                                    <View style={[styles.listIcon]}>
                                        {item.icon && item.icon}
                                    </View>
                                    <Typo size={16} style={{ flex: 1 }} fontWeight={'500'}>
                                        {item.title}
                                    </Typo>
                                    <Icons.CaretRight
                                        size={verticalScale(20)}
                                        weight="bold"
                                        color={colors.white}
                                    />
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    </ScreenWrapper>
    )
}

export default Account

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
        backgroundColor: colors.neutral900
    },
    userInfo: {
        marginTop: verticalScale(30),
        alignItems: 'center',
        gap: spacingY._15,
    },
    avatarContainer: {
        position: 'relative',
        alignSelf: 'center',
    },
    avatar: {
        alignSelf: 'center',
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
    },
    editIcon: {
        position: 'absolute',
        bottom: 5,
        right: 8,
        borderRadius: 50,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: 5,
    },
    nameContainer: {
        gap: verticalScale(4),
        alignItems: 'center',
    },
    listIcon: {
        height: verticalScale(44),
        width: verticalScale(44),
        backgroundColor: colors.neutral500,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius._15,
        borderCurve: 'continuous',
    },
    listItem: {
        marginBottom: verticalScale(17),
    },
    accountOptions: {
        marginTop: spacingY._35,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._10,
    }
})
