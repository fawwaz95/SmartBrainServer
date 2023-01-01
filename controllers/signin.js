const handleSignin = (req, res, db, bcrypt) => {
        const {email, password} = req.body;
        

        if(!email || !password){
            res.status(400).json({error:'Please specify email & password!'});
         }

           db.select('email', 'hash')
           .from('login')
           .where({'email': email})
           .then(login => {
     
                 if(login.length){
                     var isValid = bcrypt.compareSync(password, login[0].hash);
                 }
                 if(isValid){
                    return db.select('*').from('users')
                             .where({'email': email})
                             .returning('*')
                             .then(users => {
                                 res.json(users[0])
                             })
                             .catch(err => res.status(400).json('Unable to get user ' + err))
                 }else{
                     res.status(400).json('Wrong credentials');
                 }
           })
           .catch(err => res.status(400).json('Wrong credentials 2 ' + err))
}

module.exports = {
    handleSignin: handleSignin
}
