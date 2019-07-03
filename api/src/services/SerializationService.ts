

class SerializationService {

    deserializeObject(data: any, definition: any): any {
        let result = {};
        
        for(let key of Object.keys(definition)) {
            const value = data[key];
            console.log(typeof value);
        }
    }

}