
const handleRegister = (req, res, db, bcrypt) => {
        const{email, name, password} = req.body;

        if(!email || !name || !password){
            return res.status(400).json('This cant be empty!');
         }

         if(password.length < 7){
            return res.status(400).json('Password needs to be adleast 8 characters!');
         }

        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            
            const hash = bcrypt.hashSync(password);
        
            db.transaction(trx => {
                trx.insert({
                    email: email,
                    hash: hash
                })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    return trx('users')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .returning('*')
                    .then(users => {
                        return res.json(users[0]);
                    })
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
            .catch(err => 'cant register' + err);
        }else{
            return res.status(400).json('Inavlid Email!');
         }
}

module.exports = {
    handleRegister: handleRegister
}