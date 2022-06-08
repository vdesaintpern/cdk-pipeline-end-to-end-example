
exports.handler = async function(event, context) {

    var body = {
        message: "Hello API SERVERLESS env : " 
            + process.env.ENVNAME 
            + " / secret name for DB : " 
            + process.env.DB_SECRET_NAME
    }
    
    return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(body)
    };
}
