import { supabase } from '@/lib/supabase'
import { MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
// import * as ImagePicker from 'expo-image-picker'
/**
 *   <Avatar
            rounded="md"
            borderRadius="md"
            size={"2xl"}
            name={fullName}
            src={`https://lyiwefrqbflphqzwpeqm.supabase.co/storage/v1/object/public/avatars/${avatarUrl}`}
          />
 */

interface AvatarType {
  size: number
  url: string
  onUplaod?: (filePath: string) => void
  showUpload?: boolean
}

const Avatar = ({ url, size = 150, onUplaod, showUpload }: AvatarType) => {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const avatarSize = { height: size, with: size }

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url, avatarUrl])

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('Avatars')
        .download(path)

      if (error) {
        console.log(error)
        // set setAvatarUrl just for test bucket not created on supabase
        setAvatarUrl('https://reactnative.dev/img/tiny_logo.png')
        throw error
      }
      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => setAvatarUrl(fr.result as string)
    } catch (error) {
      // set setAvatarUrl just for test bucket not created on supabase
      setAvatarUrl('https://reactnative.dev/img/tiny_logo.png')
      if (error instanceof Error)
        console.log('Error while downloading image: ' + error.message)
    }
  }
  /**
   * 
   * @returns https://supabase.com/docs/reference/javascript/storage-from-upload
   * https://supabase.com/docs/reference/javascript/storage-from-createsignedurls
   * https://supabase.com/docs/guides/storage/quickstart?queryGroups=language&language=dashboard
   * https://github.com/supabase/supabase/tree/master/examples/storage
   * //https://github.com/supabase/supabase/blob/master/examples/user-management/nextjs-user-management/app/auth/confirm/route.ts
   * Upload a file
    Uploads a file to an existing bucket.

    RLS policy permissions required:
    buckets table permissions: none
    objects table permissions: only insert when you are uploading new files and select, insert and update when you are upserting files
    Refer to the Storage guide on how access control works
    For React Native, using either Blob, File or FormData does not work as intended. 
    Upload file using ArrayBuffer from base64 file data instead, see example below.


  const avatarFile = event.target.files[0]
  const { data, error } = await supabase
    .storage
    .from('avatars')
    .upload('public/avatar1.png', avatarFile, {
      cacheControl: '3600',
      upsert: false
    })

    Download a file
    Downloads a file from a private bucket. For public buckets, make a request to the URL returned from getPublicUrl instead.

    RLS policy permissions required:
    buckets table permissions: none
    objects table permissions: select
    Refer to the Storage guide on how access control works

      const { data, error } = await supabase
      .storage
      .from('avatars')
      .download('folder/avatar1.png')
       const uploadAvatar = async (data) => {
    const file = data.infoAvatar;
    const fileName = data.avatar;

    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    
    const { data } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(fileName)
    setImageUrl(data.publicUrl)

  };
   */
  // https://github.com/joestackss
  // https://www.youtube.com/watch?v=4x-k99_yuVY
  // https://github.com/joestackss
  const uploadAvatar = async () => {
    try {
      setUploading(true)

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict only images
        allowsMultipleSelection: false,
        allowsEditing: true, // Allow the user to crop/ rotate their photo before uploading it
        quality: 1,
        exif: false,
      })

      if (result.canceled || !result.assets || result?.assets?.length === 0) {
        console.log('User cancelled image picker !')
        return
      }

      const image = result?.assets[0]
      if (!image.uri) {
        throw new Error('No image uri!') // Realistically this should not happen but just in case it  happens  to happen in the browser :)
      }

      console.log('🚀 ~  imGo imageage:', image)
      const arrayBuffer = await fetch(image.uri).then((response) =>
        response.arrayBuffer()
      )

      // const arrayBuff = await axios({
      //   url: image.uri,
      //   method: 'GET',
      //   responseType: 'arraybuffer',
      // }).then((res) => {
      //   return res.data
      // })

      // console.log('🚀 🚀🚀~ uploadAvatar ~ arrayBuff:', arrayBuff)

      const fileExt = image?.uri?.split('.')?.pop()?.toLowerCase() ?? 'jpg'
      const path = `${Date.now()}.${fileExt}`

      // console.log('🚀 ~  path:', path)
      // Use the JS library to download a file.

      // const { data, error } = await supabase.storage.from('avatars').download('public/avatar1.png')

      //   let { error: uploadError } = await supabase.storage
      //   .from("avatars")
      //   .upload(fileName, file);

      // if (uploadError) {
      //   throw uploadError;
      // }

      // const { data } = supabase
      //   .storage
      //   .from('avatars')
      //   .getPublicUrl(fileName)
      // setImageUrl(data.publicUrl)

      // const avatarFile = event.target.files[0]
      // const { data, error } = await supabase.storage
      //   .from('avatars')
      //   .upload('public/avatar1.png', avatarFile, {
      //     cacheControl: '3600',
      //     upsert: false,
      //   })

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .update(path, arrayBuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        })

      if (uploadError) {
        console.log('🚀 ~ uploadAvatar ~ uploadError:', uploadError.cause)
        throw uploadError
      }

      onUplaod!(data?.path)
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      } else {
        throw error
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <View>
      {avatarUrl ? (
        <View className="relative">
          <Image
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png',
            }}
            accessibilityLabel="Avatar"
            style={[avatarSize, styles.avatar]}
          />
        </View>
      ) : (
        <View
          className="justify-center items-center"
          style={[avatarSize, styles.avatar, styles.image]}
        >
          <ActivityIndicator color={'white'} />
        </View>
      )}

      {showUpload && (
        <View className="absolute right-0 bottom-0">
          {!uploading ? (
            <Pressable onPress={uploadAvatar}>
              <MaterialIcons name="cloud-upload" color={'white'} size={20} />
            </Pressable>
          ) : (
            <ActivityIndicator color={'white'} />
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    // overflow: 'hidden',
    maxWidth: '100%',
    position: 'relative',
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: 'gray',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgb(200,200,200)',
    borderRadius: 20,
  },
})

export default Avatar
