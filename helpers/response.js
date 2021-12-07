const success = (messages, data, id, role)=>{
    return ({
        success: true,
        message: messages,
        result: data,
        id: id,
        role: role
    })
}

const error = (message, err, code) => {
    return ({
        success: false,
        message: message,
        error: err,
        code: code
    })
}

module.exports = { success, error };
