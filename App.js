import {useState} from "react";
import {Button, Image, StyleSheet, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import last from 'lodash/last';

export default function App() {
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      uploadImage(result.uri);
    }
  }

  const uploadImage = (path) => {
    // TODO: Update token from postman if expired
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvcmVoYWIuYTEudGhlZGlnaXRhbC5tZW5cL2FwaVwvbG9naW4iLCJpYXQiOjE2NDY0MDY2MjAsImV4cCI6MTY0NzAxMTQyMCwibmJmIjoxNjQ2NDA2NjIwLCJqdGkiOiJTOHFwa1Y4NGw0RWpRem5PIiwic3ViIjo3NSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.giaVbLT3fJpaMGvsM-ud7M08_PqHGmpK208gdzmzsZ8");
    myHeaders.append("Content-Type", "multipart/form-data");

    const formdata = new FormData();
    const file = {
      name: last(path.split('/')),
      uri: path,
      type: "image/png",
    };
    console.log('file', file)
     formdata.append("image", file);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://rehab.a1.thedigital.men/api/user-avatar/75", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage}/>
      {image && <Image source={{uri: image}} style={{width: 200, height: 200}}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
