import { getConnection } from "./../database/database"

const crypto = require("crypto");

const getUsers = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT id, fullName, email, userName, userPassword as usrPass, isDelete FROM users");
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT id, fullName, email, userName, userPassword as usrPass, isDelete FROM users WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const addUser = async (req, res) => {
    try {
        const { fullName, userName, email, usrPass, isDelete } = req.body;

        if (fullName === undefined || userName === undefined || usrPass === undefined || email === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const encrypPassword = hashAES256(usrPass);
        const usrPassword = encrypPassword;

        const user = { fullName, userName, email, usrPassword, isDelete };
        const connection = await getConnection();
        await connection.query("INSERT INTO users SET ?", user);
        res.json({ message: "Usuario registrado" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, userName, email, usrPass, isDelete } = req.body;

        if (fullName === undefined || userName === undefined || usrPass === undefined || email === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const encrypPassword = hashAES256(usrPass);
        const usrPassword = encrypPassword;

        const user = { fullName, userName, email, usrPassword, isDelete };
        const connection = await getConnection();
        await connection.query("UPDATE users SET ? WHERE id = ?", [user, id]);
        res.json({ message: "Usuario editado" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const connection = await getConnection();
        const result = await connection.query("UPDATE users SET isDelete = 0 WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const authUser = async (req, res) => {
    try {
        const { email, usrPass } = req.body;

        if (usrPass === undefined || email === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }
        
        const connection = await getConnection();
        const userExist = await connection.query("SELECT id, fullName, email, usrPassword as usrPass, userName, isDelete FROM users WHERE isDelete > 0 AND email = ? AND usrPassword = ?", [email, usrPass]);
        
        const encrypPassword = checkhashAES256(usrPass);
        const result = JSON.parse(JSON.stringify(userExist));
        
        if(usrPass === result[0].usrPass) {
            res.json({ message: "Usuario encontrado", user: userExist });
        } else {
            res.json({ message: "Correo/Contraseña incorrectas" });
        }

    } catch (error) {
        res.status(500).json({message: "Correo/Contraseña incorrectas"});
 
    }
};

export const methods = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    authUser
};

function hashAES256(password){
    // let cipher = crypto.createCipher('aes-256-cbc', secretKey);

    // let encryptedText = cipher.update(plaintext, 'utf8', 'hex');
    // encryptedText += cipher.final('hex');
    // return encryptedText;
    return password;
};

function checkhashAES256(password) {
    // const decipher = crypto.createDecipher('aes-256-cbc', secretKey);

    // let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
    // return decryptedText += decipher.final('utf8');
    return password;
}
