const Clarifai = require ('clarifai');

const app = new Clarifai.App({
    apiKey: '9c620edbc553424fab635c559d3c7a1a'
});

const handleApiCall = (req, res) => {
    app.models
        .predict({
            id: "face-detection",
            version: "6dc7e46bc9124c5c8824be4822abe105",
          },
          req.body.input)
        .then(data => {
            return res.json(data);
        })
        .catch(err => res.status(400).json(err));
}

const handleImage = (req, res, db) => {
    var {id} = req.body;

    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(data => {
        console.log('The entries: ' + data[0].entries)
        res.json(data[0].entries);
    }).catch(err => console.log('Somthing went wrong here' + err));
}

module.exports = {
    handleApiCall: handleApiCall,
    handleImage: handleImage,
}