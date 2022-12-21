const handleProfile = (req, res, db) => {
    const {id} = req.params;

    db.select('*').from('users').where({
        id: id,
    }).then(data => {
        if(data.length){
            res.json(data[0]);
        }else{
            res.status(400).json("Not found");
        }
    }).catch(err => console.log('Error retrieving user info'));
}

module.exports = {
    handleProfile: handleProfile
}