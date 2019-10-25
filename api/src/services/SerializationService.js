

class SerializationService {

    deserializeObject(data, definition) {
        let result = {};
        
        for(let key of Object.keys(definition)) {
            const value = data[key];
            console.log(typeof value);
        }
    }

}