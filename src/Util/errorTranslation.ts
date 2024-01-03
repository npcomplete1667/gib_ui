const errorTranslation:{[key: string]: string}= {
    'duplicate key value violates unique constraint "wallet_pkey"' : 'Wallet Address Already Associated with another user',
    'duplicate key value violates unique constraint "account_username_key"' : 'Username Already Exists'
}

const translateError = (error_message:string) => {
    if(error_message in errorTranslation){
        return errorTranslation[error_message]
    }
    console.log("Unknown Error Occurred:", error_message)
    return "Unknown Error Occurred"
}

export default translateError