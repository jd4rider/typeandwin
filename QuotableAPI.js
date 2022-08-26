const axios = require('axios');

const uri = 'https://api.quotable.io/random';

module.exports = getData = () => {
    return axios.get(uri)
        .then(response => {
            return response.data.content.split(' ');
        })
        .catch(error => {
            console.log(error);
        });
};